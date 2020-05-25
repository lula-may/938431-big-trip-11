import AbstractComponent from "./abstract-component";
import {formatDurationTime, getEventDescription} from "../utils/common.js";
import moment from "moment";


const getOffersMarkup = (offers) => {
  return offers.slice(0, 3)
    .map((offer) => {
      return (
        `<li class="event__offer">
          <span class="event__offer-title">${offer.title}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </li>`
      );
    })
  .join(`\n`);
};

const getEventTemplate = (event) => {
  const {type, dateFrom, dateTo, destination, price, offers} = event;
  const from = moment(dateFrom);
  const to = moment(dateTo);
  const timeFrom = from.format(`HH:mm`);
  const timeTo = to.format(`HH:mm`);
  const duration = to.diff(from, `minutes`);
  const durationText = formatDurationTime(duration);
  const offersMarkup = getOffersMarkup(offers);
  const description = getEventDescription(type, destination);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${description}</h3>

      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${from.format()}">${timeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="${to.format()}">${timeTo}</time>
        </p>
        <p class="event__duration">${durationText}</p>
      </div>

      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersMarkup}
      </ul>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};

export default class Event extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return getEventTemplate(this._event);
  }

  setRollupButtonClickHandler(handler) {
    const buttonElement = this.getElement().querySelector(`.event__rollup-btn`);
    buttonElement.addEventListener(`click`, handler);
  }
}
