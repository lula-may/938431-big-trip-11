import EditEventComponent, {getShortName, parseDate} from "../components/edit-event.js";
import EventComponent from "../components/event.js";
import {render, replace, remove} from "../utils/render.js";
import {offersByType} from "../mock/point.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

const parseFormData = (formData) => {
  const type = formData.get(`event-type`);
  const destination = formData.get(`event-destination`);
  const dateFrom = parseDate(formData.get(`event-start-time`));
  const dateTo = parseDate(formData.get(`event-end-time`));
  const price = formData.get(`event-price`);
  const isFavorite = !!(formData.get(`event-favorite`));
  const offersNames = formData.getAll(`event-offer`);
  const availabledOffers = offersByType[type];
  const offers = offersNames.map((name) => {
    return availabledOffers.find((offer) => getShortName(offer.title) === name);
  });

  return {
    type,
    dateFrom,
    dateTo,
    destination,
    price,
    offers,
    isFavorite
  };
};

export default class EventController {
  constructor(container, destinations, onViewChange, onDataChange) {
    this._container = container;
    this._destinations = destinations;
    this._eventComponent = null;
    this._editEventComponent = null;
    this._mode = Mode.DEFAULT;
    this._event = null;
    this.id = ``;
    this._offers = [];
    this._onViewChange = onViewChange;
    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event) {
    this._event = event;
    this.id = this._event.id || ``;
    this._offers = offersByType;

    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EditEventComponent(event, this._offers, this._destinations);

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replacePointToEdit();
    });

    this._editEventComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToPoint();
    });

    this._editEventComponent.setFavoriteButtonClickHandler(() => {
      const newData = Object.assign({}, event, {isFavorite: !event.isFavorite});
      this._onDataChange(event, newData);
    });

    this._editEventComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
      const formData = this._editEventComponent.getData();
      const newData = parseFormData(formData);
      newData.id = this.id || ``;
      this._onDataChange(event, newData);
    });

    this._editEventComponent.setDeleteClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
    });

    switch (this._mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEditEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._editEventComponent, oldEditEventComponent);
          this._replaceEditToPoint();
        } else {
          render(this._container, this._eventComponent);
        }
        break;
      case Mode.EDIT:
        if (oldEventComponent && oldEditEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._editEventComponent, oldEditEventComponent);
          this._replacePointToEdit();
          break;
        }
    }
  }

  rerender(id, newPoint) {
    if (this._event.id !== id) {
      return;
    }
    this.render(newPoint);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._editEventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._editEventComponent, this._eventComponent);
    this._mode = Mode.EDIT;
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEditToPoint() {
    if (document.contains(this._editEventComponent.getElement())) {
      replace(this._eventComponent, this._editEventComponent);
    }
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._editEventComponent.resetDescriptionShowing();
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey && evt.target.tagName !== `INPUT`) {
      this._editEventComponent.reset();
      this._replaceEditToPoint();
    }
  }
}
