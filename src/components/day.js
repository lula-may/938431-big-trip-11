import AbstractComponent from "./abstract-component.js";
import {SortType} from "../const.js";

export default class Day extends AbstractComponent {
  constructor(activeSort, counter = null, date = null) {
    super();
    this._counter = counter;
    this._date = date;
    this._activeSort = activeSort;
  }

  getTemplate() {
    const isDayShowed = this._activeSort === SortType.EVENT;
    const counter = this._counter;
    const date = this._date ? this._date.toLocaleString(`en-GB`, {month: `short`, day: `numeric`}) : null;

    return (
      `<li class="trip-days__item  day">
        <div class="day__info">
        ${isDayShowed
        ? `<span class="day__counter">${counter}</span>
          <time class="day__date" datetime="2019-03-18">${date}</time>`
        : ``}
        </div>
        <ul class="trip-events__list"></ul>
      </li>`);
  }
}
