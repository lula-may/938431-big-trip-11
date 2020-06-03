import AbstractSmartComponent from "./abstract-smart-component.js";

import {MEANS_OF_TRANSPORT, PLACES} from "../const.js";
import {capitalizeFirstLetter, getEventTitle, formatFullDate} from "../utils/common.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {Mode} from "../controllers/point-controller.js";

export const getShortName = (text) => {
  return text
    .split(` `)
    .slice(length - 2)
    .join(`-`)
    .toLowerCase();
};

export const parseDate = (date) => flatpickr.parseDate(date, `d/m/y H:i`);

const getRadioListMarkup = (items, id, checkedItem) => {
  return items.map((type) => {
    const typeText = capitalizeFirstLetter(type);
    const isChecked = checkedItem === type;
    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio"
          name="event-type" value="${type}" ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${typeText}</label>
      </div>`
    );
  })
  .join(`\n`);
};

const getDatasetMarkup = (destinations) => {
  return destinations
    .map((item) => `<option value="${item}"></option>`)
    .join(`\n`);
};

const getButtonsMarkup = (isCreatingPoint, id, isFavorite) => {
  return isCreatingPoint
    ? `<button class="event__reset-btn" type="reset">Cancel</button>`
    : `<button class="event__reset-btn" type="reset">Delete</button>

      <input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox"
        name="event-favorite" ${isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-${id}">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>`;
};

const getOffersMarkup = (offers, availableOffers, id) => {
  return availableOffers
    .map((item) => {
      const title = item.title;
      const shortTitle = getShortName(title);
      const isChecked = offers.some((offer) => offer.title === title);
      const price = item.price;
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${shortTitle}-${id}"
            type="checkbox" name="event-offer" value="${shortTitle}" ${isChecked ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${shortTitle}-${id}">
            <span class="event__offer-title">${title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const getPicturesMarkup = (pictures) => {
  return pictures.map((item) => {
    const pictureSrc = item.src;
    const altText = item.description;
    return `<img class="event__photo" src="${pictureSrc}" alt="${altText}">`;
  })
  .join(`\n`);
};

const getDestinationDescriptionMarkup = (destination) => {
  const {description, pictures} = destination;
  const isDescription = !!description;
  const picturesMarkup = getPicturesMarkup(pictures);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${isDescription ? description : ``}</p>

      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${picturesMarkup}
        </div>
      </div>
    </section>`
  );
};

const getEditFormTemplate = (options = {}) => {
  const {
    id,
    type,
    destination,
    dateFrom,
    dateTo,
    price,
    isFavorite,
    offers,
    availableOffers,
    availableDestinations,
    mode
  } = options;

  const fullDateFrom = formatFullDate(dateFrom);
  const fullDateTo = formatFullDate(dateTo);
  const transportListMarkup = getRadioListMarkup(MEANS_OF_TRANSPORT, id, type);
  const activityListMarkup = getRadioListMarkup(PLACES, id, type);
  const eventTitle = getEventTitle(type);
  const name = destination.name;
  const destinationsDatasetMarkup = getDatasetMarkup(availableDestinations);
  const areOffers = !!(availableOffers.length);
  const offersMarkup = areOffers ? getOffersMarkup(offers, availableOffers, id) : ``;
  const isDescription = !!destination.description || !!destination.pictures.length;
  const descriptionMarkup = isDescription ? getDestinationDescriptionMarkup(destination) : ``;
  const isBottomBlockShowing = areOffers || isDescription;
  const isCreatingPoint = mode === Mode.ADDING;
  const buttonsMarkup = getButtonsMarkup(isCreatingPoint, id, isFavorite);

  return (
    `<form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transportListMarkup}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityListMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${eventTitle}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}"
            type="text" name="event-destination" value="${name}" list="destination-list-${id}" required>
          <datalist id="destination-list-${id}">
            ${destinationsDatasetMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${fullDateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${fullDateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${buttonsMarkup}
      </header>

      ${isBottomBlockShowing
      ? `<section class="event__details">
          ${areOffers
      ? `<section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
              ${offersMarkup}
              </div>
            </section>`
      : ``
    }
          ${descriptionMarkup}
        </section>`
      : ``
    }
      </form>`
  );
};

export default class EditEvent extends AbstractSmartComponent {
  constructor(point, offersModel, destinationsModel, mode) {
    super();
    this._point = point;
    this._id = point.id || `new`;
    this._type = point.type;
    this._dateFrom = point.dateFrom;
    this._dateTo = point.dateTo;
    this._destination = point.destination;
    this._price = point.price;
    this._offers = point.offers;
    this._isFavorite = point.isFavorite;

    this._destinationsModel = destinationsModel;
    this._offersModel = offersModel;
    this._availableDestinations = this._destinationsModel.getDestinations().map((item) => item.name);
    this._mode = mode;
    this._changedControl = null;

    this._dateFromFlatpicker = null;
    this._dateToFlatpicker = null;

    this._favoriteButtonClickHandler = null;
    this._rollupHandler = null;
    this._submitHandler = null;
    this._deleteClickHandler = null;

    this._subscribeOnEvents();
    this._applyFlatpickers();
  }

  getTemplate() {
    const availableOffers = this._offersModel.getOffersByType(this._type).offers;

    return getEditFormTemplate({
      id: this._id,
      type: this._type,
      destination: this._destination,
      dateFrom: this._dateFrom,
      dateTo: this._dateTo,
      price: this._price,
      isFavorite: this._isFavorite,
      offers: this._offers,
      availableOffers,
      availableDestinations: this._availableDestinations,
      mode: this._mode
    });
  }

  getUpdatedPoint() {
    return this._updatedPoint;
  }

  rerender() {
    super.rerender();
    this._applyFlatpickers();
  }

  recoveryListeners() {
    this.setRollupButtonClickHandler(this._rollupHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteClickHandler(this._deleteClickHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this._subscribeOnEvents();
  }

  setRollupButtonClickHandler(handler) {
    if (this._mode === Mode.ADDING) {
      return;
    }
    const rollupButtonElement = this.getElement().querySelector(`.event__rollup-btn`);
    this._rollupHandler = handler;
    rollupButtonElement.addEventListener(`click`, handler);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setDeleteClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);
    this._deleteClickHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    const favoriteButtonElement = this.getElement().querySelector(`.event__favorite-checkbox`);
    if (favoriteButtonElement) {
      favoriteButtonElement.addEventListener(`click`, (evt) => {
        this._changedControl = evt.target;
        handler();
      });
      this._favoriteButtonClickHandler = handler;
    }
  }

  reset() {
    const point = this._point;
    this._type = point.type;
    this._destination = point.destination;
    this._price = point.price;
    this._dateFrom = point.dateFrom;
    this._dateTo = point.dateTo;
    this._offers = point.offers;
    this.rerender();
  }

  disableControls() {
    const controls = this.getElement().querySelectorAll(`button, input`);
    controls.forEach((control) => {
      control.disabled = true;
    });
  }

  enableControls() {
    const controls = this.getElement().querySelectorAll(`input:disabled, button:disabled`);
    controls.forEach((control) => {
      control.disabled = false;
    });
  }

  undoChanges() {
    if (!this._changedControl) {
      return;
    }
    this._changedControl.checked = !this._changedControl.checked;
    this._changedControl = null;
  }

  getData() {
    const form = this.getElement();
    const data = new FormData(form);
    return data;
  }

  setButtonText({deleteButtonText, saveButtonText}) {
    if (deleteButtonText && this._mode !== Mode.ADDING) {
      this.getElement().querySelector(`.event__reset-btn`).textContent = deleteButtonText;
    }

    if (saveButtonText) {
      this.getElement().querySelector(`.event__save-btn`).textContent = saveButtonText;
    }
  }

  resetButtonText() {
    this.setButtonText({deleteButtonText: `Delete`, saveButtonText: `Save`});
  }

  _applyFlatpickers() {
    if (this._dateToFlatpicker) {
      this._dateToFlatpicker.destroy();
    }
    if (this._dateFromFlatpicker) {
      this._dateFromFlatpicker.destroy();
    }
    const element = this.getElement();
    const dateFromInputElement = element.querySelector(`#event-start-time-${this._id}`);
    const dateToElement = element.querySelector(`#event-end-time-${this._id}`);
    this._dateFromFlatpicker = flatpickr(dateFromInputElement, {
      altInput: true,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate: this._dateFrom || `today`,
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      maxDate: this._dateTo,
      onChange: (days) => {
        this._dateFrom = days[0];
        if (this._dateTo < this._dateFrom) {
          this._dateTo = new Date(this._dateFrom);
          this._dateToFlatpicker.setDate(this._dateTo);
        }
        this._dateToFlatpicker.set(`minDate`, this._dateFrom);
      }
    });

    this._dateToFlatpicker = flatpickr(dateToElement, {
      altInput: true,
      altFormat: `d/m/y H:i`,
      allowInput: true,
      defaultDate: this._dateTo || `today`,
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      minDate: this._dateFrom,
      onChange: (days) => {
        this._dateTo = days[0];
        this._dateFromFlatpicker.set(`maxDate`, this._dateTo);
      }
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    const destinationInputElement = element.querySelector(`.event__input--destination`);

    // Обработчик изменения типа события
    element.querySelector(`.event__type-list`)
    .addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }
      this._type = evt.target.value;
      this.rerender();
    });

    // Обработчики изменения места назначения
    destinationInputElement.addEventListener(`input`, () => {
      this._setDestinationInputValidity();
      if (!destinationInputElement.checkValidity()) {
        destinationInputElement.value = ``;
      }
    });

    destinationInputElement.addEventListener(`change`, (evt) => {
      if (!destinationInputElement.checkValidity()) {
        destinationInputElement.value = ``;
        return;
      }
      this._destination = this._destinationsModel.getDestinationByName(evt.target.value);
      this.rerender();
    });

    // Обработчик изменения цены
    element.querySelector(`.event__input--price`).addEventListener(`change`, (evt) => {
      this._price = evt.target.value;
    });
  }

  _setDestinationInputValidity() {
    const inputElement = this.getElement().querySelector(`.event__input--destination`);
    const matchesToOption = this._availableDestinations.some((destination) => destination === inputElement.value);

    if (!matchesToOption) {
      inputElement.setCustomValidity(`Please choose one of the options from the list`);
    } else {
      inputElement.setCustomValidity(``);
    }
  }
}
