import AbstractSmartComponent from "./abstract-smart-component.js";
import {MEANS_OF_TRANSPORT, PLACES} from "../const.js";
import {capitalizeFirstLetter, getEventDescription, formatFullDate} from "../utils/common.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const getShortName = (text) => {
  return text.split(` `).pop().toLowerCase();
};

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
            type="checkbox" name="event-offer-${shortTitle}" ${isChecked ? `checked` : ``}>
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

const getEditFormTemplate = (options = {}) => {
  const {id, type, destination, dateFrom, dateTo, price, isFavorite, offers, availableOffers, availableDestinations} = options;
  const fullDateFrom = formatFullDate(dateFrom);
  const fullDateTo = formatFullDate(dateTo);
  const transportListMarkup = getRadioListMarkup(MEANS_OF_TRANSPORT, id, type);
  const activityListMarkup = getRadioListMarkup(PLACES, id, type);
  const eventTitle = getEventDescription(type);
  const destinations = availableDestinations.map((item) => item.name);
  const destinationsDatasetMarkup = getDatasetMarkup(destinations);
  const areOffers = !!(offers.length);
  const offersMarkup = areOffers ? getOffersMarkup(offers, availableOffers, id) : ``;
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
            type="text" name="event-destination" value="${destination}" list="destination-list-${id}" required>
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
          <input class="event__input  event__input--price" id="event-price-${id}" type="id" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

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
        </button>
      </header>

      ${areOffers
      ? `<section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
            ${offersMarkup}
            </div>
          </section>
        </section>`
      : ``
    }
    </form>`
  );
};

export default class EditEvent extends AbstractSmartComponent {
  constructor(event, availableOffers, availableDestinations) {
    super();
    this._event = event;
    this._id = event.id;
    this._type = event.type;
    this._dateFrom = event.dateFrom;
    this._dateTo = event.dateTo;
    this._destination = event.destination;
    this._price = event.price;
    this._offers = event.offers;
    this._isFavorite = event.isFavorite;

    this._availableOffers = availableOffers;
    this._availableDestinations = availableDestinations;

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
    return getEditFormTemplate({
      id: this._id,
      type: this._type,
      destination: this._destination,
      dateFrom: this._dateFrom,
      dateTo: this._dateTo,
      price: this._price,
      isFavorite: this._isFavorite,
      offers: this._offers,
      availableOffers: this._availableOffers[this._type],
      availableDestinations: this._availableDestinations
    });
  }

  recoveryListeners() {
    this.setRollupButtonClickHandler(this._rollupHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonClickHandler);
    this.setSubmitHandler(this._submitHandler);
    this.setDeleteClickHandler(this._deleteClickHandler);
    this._subscribeOnEvents();
  }

  setRollupButtonClickHandler(handler) {
    const rollupButtonElement = this.getElement().querySelector(`.event__rollup-btn`);
    this._rollupHandler = handler;
    rollupButtonElement.addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`)
      .addEventListener(`click`, handler);
    this._favoriteButtonClickHandler = handler;
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


    destinationInputElement.addEventListener(`input`, (evt) => {
      this._setDestinationInputValidity();
      if (!destinationInputElement.checkValidity()) {
        return;
      }
      this._destination = evt.target.value;
    });
  }

  _setDestinationInputValidity() {
    const inputElement = this.getElement().querySelector(`.event__input--destination`);

    const matchesToOption = this._availableDestinations.some((destination) => destination.name === inputElement.value);
    if (!matchesToOption) {
      inputElement.setCustomValidity(`Please choose one of the options from the list`);
    } else {
      inputElement.setCustomValidity(``);
    }
  }
}
