import EditPointComponent, {getShortName, parseDate} from "../components/edit-point.js";
import PointComponent from "../components/point.js";

import PointModel from "../models/point.js";

import {render, replace, remove} from "../utils/render.js";
import {POINT_TYPES} from "../const.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`
};

const ADDING_NEW_POINT_CLASS = `trip-points__item`;

const defaultType = POINT_TYPES[0];

const EmptyPoint = {
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

const parseFormData = (formData, destinationsModel, offersModel) => {
  const type = formData.get(`event-type`);
  const destinationName = formData.get(`event-destination`);
  const destination = destinationsModel.getDestinationByName(destinationName);
  const offersNames = formData.getAll(`event-offer`);
  const availabledOffers = offersModel.getOffersByType(type).offers;
  const offers = offersNames.map((name) => {
    return availabledOffers.find((offer) => getShortName(offer.title) === name);
  });

  return new PointModel({
    "type": type,
    "date_from": parseDate(formData.get(`event-start-time`)),
    "date_to": parseDate(formData.get(`event-end-time`)),
    "destination": destination,
    "base_price": parseInt(formData.get(`event-price`), 10),
    "offers": offers,
    "is_favorite": !!(formData.get(`event-favorite`))
  });
};

export default class PointController {
  constructor(container, destinationsModel, offersModel, onViewChange, onDataChange) {
    this._container = container;
    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._pointComponent = null;
    this._editPointComponent = null;
    this._mode = Mode.DEFAULT;
    this._point = null;
    this._onViewChange = onViewChange;
    this._onDataChange = onDataChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point) {
    if (!point) {
      this._mode = Mode.ADDING;
      point = Object.assign({}, EmptyPoint);
    }

    this._point = point;


    const oldPointComponent = this._pointComponent;
    const oldEditPointComponent = this._editPointComponent;

    this._pointComponent = new PointComponent(point);
    this._editPointComponent = new EditPointComponent(point, this._offersModel, this._destinationsModel, this._mode);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToEdit();
    });

    this._editPointComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToPoint();
      if (this._editPointComponent.isUpdated) {
        const newData = this._editPointComponent.getUpdatedPoint();
        this._onDataChange(point, newData);
      }
    });

    this._editPointComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._editPointComponent.getData();
      const newData = parseFormData(formData, this._destinationsModel, this._offersModel);
      newData.id = this._point.id;
      this._onDataChange(point, newData);
      this._replaceEditToPoint();
    });

    this._editPointComponent.setDeleteClickHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
      this._onDataChange(point, null);
    });

    switch (this._mode) {
      case Mode.DEFAULT:
        if (oldPointComponent && oldEditPointComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._editPointComponent, oldEditPointComponent);
          this._replaceEditToPoint();
        } else {
          render(this._container, this._pointComponent);
        }
        break;
      case Mode.EDIT:
        if (oldPointComponent && oldEditPointComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._editPointComponent, oldEditPointComponent);
          this._replacePointToEdit();
        }
        break;
      case Mode.ADDING:
        this._editPointComponent.getElement().classList.add(ADDING_NEW_POINT_CLASS);
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._editPointComponent);
    }
  }

  rerender(id, newPoint) {
    if (this._point.id !== id) {
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
    remove(this._pointComponent);
    remove(this._editPointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  removeCreatingPoint() {
    if (this._mode !== Mode.ADDING) {
      return;
    }
    this._onDataChange(EmptyPoint, null);
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._editPointComponent, this._pointComponent);
    this._mode = Mode.EDIT;
    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _replaceEditToPoint() {
    if (document.contains(this._editPointComponent.getElement())) {
      replace(this._pointComponent, this._editPointComponent);
    }
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey && evt.target.type !== `text` && evt.target.type !== `number`) {
      this.removeCreatingPoint();
      if (this._editPointComponent.isUpdated) {
        const newData = this._editPointComponent.getUpdatedPoint();
        this._onDataChange(this._point, newData);
      }
      this._editPointComponent.reset();
      this._replaceEditToPoint();
    }
  }
}
