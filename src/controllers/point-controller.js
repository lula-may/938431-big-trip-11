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
    this._updatedEditPointComponent = null;
    this._changedControl = null;
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
    this._createEditPointComponent();

    switch (this._mode) {
      case Mode.ADDING:
        this._editPointComponent.getElement().classList.add(ADDING_NEW_POINT_CLASS);
        render(this._container, this._editPointComponent);
        document.addEventListener(`keydown`, this._onEscKeyDown);
        break;
      default:
        this._renderPoint();
    }
  }

  _setEditFormHandlers() {
    this._editPointComponent.setRollupButtonClickHandler(() => {
      this._replaceEditToPoint();
    });

    this._editPointComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._editPointComponent.getData();
      this._editPointComponent.disableControls();
      this._editPointComponent.setButtonText({saveButtonText: `Saving...`});
      const newData = parseFormData(formData, this._destinationsModel, this._offersModel);
      this._onDataChange(this._point, newData)
        .then(() => {
          this._replaceEditToPoint();
          this._onViewChange(Mode.DEFAULT);
        })
        .catch(() => {
          this._editPointComponent.enableControls();
          this._editPointComponent.resetButtonText();
        });
    });

    this._editPointComponent.setDeleteClickHandler((evt) => {
      evt.preventDefault();
      this._editPointComponent.disableControls();
      this._editPointComponent.setButtonText({deleteButtonText: `Deleting...`});
      this._onDataChange(this._point, null)
        .catch(() => {
          this._editPointComponent.enableControls();
          this._editPointComponent.resetButtonText();
        });
    });

    this._editPointComponent.setFavoriteButtonClickHandler(() => {
      const newData = PointModel.clone(this._point);
      newData.isFavorite = !newData.isFavorite;
      this._onDataChange(this._point, newData)
        .then(() => this._editPointComponent.enableControls())
        .catch(() => {
          this._editPointComponent.undoChanges();
        });
    });

  }

  _createEditPointComponent() {
    const point = this._point;
    const oldEditPointComponent = this._editPointComponent;

    this._updatedEditPointComponent = new EditPointComponent(point, this._offersModel, this._destinationsModel, this._mode);
    if (!oldEditPointComponent || this._mode === Mode.DEFAULT) {
      this._editPointComponent = this._updatedEditPointComponent;
      this._updatedEditPointComponent = null;
      this._setEditFormHandlers();
    }
  }

  _renderPoint() {
    const oldPointComponent = this._pointComponent;
    this._pointComponent = new PointComponent(this._point);

    this._pointComponent.setRollupButtonClickHandler(() => {
      this._replacePointToEdit();
    });

    if (oldPointComponent) {
      replace(this._pointComponent, oldPointComponent);
    } else {
      render(this._container, this._pointComponent);
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

    if (this._updatedEditPointComponent) {
      this._editPointComponent = this._updatedEditPointComponent;
      this._setEditFormHandlers();
      this._updatedEditPointComponent = null;
    }

    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey && evt.target.type !== `text` && evt.target.type !== `number`) {
      this.removeCreatingPoint();
      this._replaceEditToPoint();
    }
  }
}
