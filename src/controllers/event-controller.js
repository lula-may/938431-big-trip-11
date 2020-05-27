import EditEventComponent from "../components/edit-event.js";
import EventComponent from "../components/event.js";
import {render, replace, remove} from "../utils/render.js";
import {offersByType} from "../mock/point.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

export default class EventController {
  constructor(container, destinations, onViewChange, onDataChange) {
    this._container = container;
    this._destinations = destinations;
    this._eventComponent = null;
    this._editEventComponent = null;
    this._mode = Mode.DEFAULT;
    this._event = null;
    this._offers = [];
    this._onViewChange = onViewChange;
    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(event, mode = Mode.DEFAULT) {
    this._mode = mode;
    this._event = event;
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
      // this._onDataChange(event, newData);
    });

    this._editEventComponent.setDeleteClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
    });

    switch (this._mode) {
      case Mode.DEFAULT:
        if (oldEventComponent && oldEditEventComponent) {
          replace(this._eventComponent, oldEditEventComponent);
          replace(this._editEventComponent, oldEditEventComponent);
          this._replaceEditToPoint();
        } else {
          render(this._container, this._eventComponent);
        }
        break;
    }
  }

  rerender(id, newPoint) {
    if (this._event.id === id) {
      this.render(newPoint);
    }
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
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      this._replaceEditToPoint();
      this._editEventComponent.reset();
    }
  }
}
