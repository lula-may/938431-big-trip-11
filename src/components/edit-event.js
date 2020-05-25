import AbstractComponent from "./abstract-component";
import {MEANS_OF_TRANSPORT, PLACES} from "../const.js";
import {capitalizeFirstLetter, getEventDescription, formatFullDate} from "../utils/common.js";

const getShortName = (text) => {
  return text.split(` `).pop().toLowerCase();
};

const getRadioListMarkup = (items, number, checkedItem) => {
  return items.map((type) => {
    const typeText = capitalizeFirstLetter(type);
    const isChecked = checkedItem === type;
    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-${number}" class="event__type-input  visually-hidden" type="radio"
          name="event-type" value="${type}" ${isChecked ? `checked` : ``}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${number}">${typeText}</label>
      </div>`
    );
  })
  .join(`\n`);
};

const getOffersMarkup = (offers, availableOffers, number) => {
  return availableOffers
    .map((item) => {
      const title = item.title;
      const shortTitle = getShortName(title);
      const isChecked = offers.some((offer) => offer.title === title);
      const price = item.price;
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${shortTitle}-${number}"
            type="checkbox" name="event-offer-${shortTitle}" ${isChecked ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${shortTitle}-${number}">
            <span class="event__offer-title">${title}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${price}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const getEditFormTemplate = (number, event, availableOffers) => {
  const {type, destinationName, dateFrom, dateTo, price, isFavorite, offers} = event;
  const fullDateFrom = formatFullDate(dateFrom);
  const fullDateTo = formatFullDate(dateTo);
  const transportListMarkup = getRadioListMarkup(MEANS_OF_TRANSPORT, number, type);
  const activityListMarkup = getRadioListMarkup(PLACES, number, type);
  const eventTitle = getEventDescription(type);
  const offersMarkup = getOffersMarkup(offers, availableOffers, number);
  return (
    `<form class="event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${number}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${number}" type="checkbox">

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
          <label class="event__label  event__type-output" for="event-destination-${number}">
            ${eventTitle}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${number}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${number}">
          <datalist id="destination-list-${number}">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${number}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${number}" type="text" name="event-start-time" value="${fullDateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${number}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${number}" type="text" name="event-end-time" value="${fullDateTo}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${number}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${number}" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-${number}" class="event__favorite-checkbox  visually-hidden" type="checkbox"
          name="event-favorite" ${isFavorite ? `checked` : ``}>
        <label class="event__favorite-btn" for="event-favorite-${number}">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${offersMarkup}
          </div>
        </section>
      </section>
    </form>`
  );
};

export default class EditEvent extends AbstractComponent {
  constructor(event, index, availableOffers) {
    super();
    this._event = event;
    this._index = index;
    this._offers = availableOffers;
  }

  getTemplate() {
    return getEditFormTemplate(this._index, this._event, this._offers);
  }

  setRollupButtonClickHandler(handler) {
    const rollupButtonElement = this.getElement().querySelector(`.event__rollup-btn`);
    rollupButtonElement.addEventListener(`click`, handler);
  }
}
