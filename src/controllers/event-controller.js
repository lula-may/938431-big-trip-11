import EditEventComponent, {getShortName, parseDate} from "../components/edit-event.js";
import EventComponent from "../components/event.js";
import {render, replace, remove} from "../utils/render.js";
import {offersByType} from "../mock/point.js";
import {EVENT_TYPES} from "../const.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

const ADDING_NEW_EVENT_CLASS = `trip-events__item`;

const defaultType = EVENT_TYPES[0];

const EmptyEvent = {
  type: defaultType,
  destination: {
    name: ``,
    description: null,
    pictures: []
  },
  dateFrom: null,
  dateTo: null,
  price: ``,
  offers: [],
  isFavorite: false
};

const parseFormData = (formData, destinationsModel) => {
  const type = formData.get(`event-type`);
  const destinationName = formData.get(`event-destination`);
  const destination = destinationsModel.getDestinationByName(destinationName);
  const dateFrom = parseDate(formData.get(`event-start-time`));
  const dateTo = parseDate(formData.get(`event-end-time`));
  const price = parseInt(formData.get(`event-price`), 10);
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
  constructor(container, destinationsModel, onViewChange, onDataChange) {
    this._container = container;
    this._destinationsModel = destinationsModel;
    this._eventComponent = null;
    this._editEventComponent = null;
    this._mode = Mode.DEFAULT;
    this.id = ``;
    this._event = null;
    this._offers = [];
    this._onViewChange = onViewChange;
    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event) {
    if (!event) {
      this._mode = Mode.ADDING;
      event = Object.assign({}, EmptyEvent);
    }

    this._event = event;
    this.id = event.id || ``;
    this._offers = offersByType;


    const oldEventComponent = this._eventComponent;
    const oldEditEventComponent = this._editEventComponent;

    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EditEventComponent(event, this._offers, this._destinationsModel, this._mode);

    this._eventComponent.setRollupButtonClickHandler(() => {
      this._replacePointToEdit();
    });

    this._editEventComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToPoint();
      if (this._editEventComponent.isUpdated) {
        const newData = this._editEventComponent.getUpdatedEvent();
        this._onDataChange(event, newData);
      }
    });

    this._editEventComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._editEventComponent.getData();
      const newData = parseFormData(formData, this._destinationsModel);
      newData.id = this.id || ``;
      this._onDataChange(event, newData);
      this._replaceEditToPoint();
    });

    this._editEventComponent.setDeleteClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
      this._onDataChange(event, null);
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
        }
        break;
      case Mode.ADDING:
        this._editEventComponent.getElement().classList.add(ADDING_NEW_EVENT_CLASS);
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._editEventComponent);
    }
  }

  rerender(id, newPoint) {
    if (this.id !== id) {
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

  removeCreatingPoint() {
    if (this._mode !== Mode.ADDING) {
      return;
    }
    this._onDataChange(EmptyEvent, null);
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
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey && evt.target.type !== `text` && evt.target.type !== `number`) {
      this.removeCreatingPoint();
      if (this._editEventComponent.isUpdated) {
        const newData = this._editEventComponent.getUpdatedEvent();
        this._onDataChange(this._event, newData);
      }
      this._editEventComponent.reset();
      this._replaceEditToPoint();
    }
  }
}
