import AbstractComponent from "./abstract-component.js";
import {SortType} from "../const.js";

export default class Day extends AbstractComponent {
  constructor(counter, date, activeSort) {
    super();
    this._counter = counter;
    this._date = date;
    this._activeSort = activeSort;
  }

  getTemplate() {
    const isDayShowed = this._activeSort === SortType.EVENT;
    const counter = this._counter;
    const date = this._date.toLocaleString(`en-GB`, {month: `short`, day: `numeric`});
    return (
      `<li class="trip-days__item  day">
      ${isDayShowed
        ? `<div class="day__info">
            <span class="day__counter">${counter}</span>
            <time class="day__date" datetime="2019-03-18">${date}</time>
          </div>`
        : ``}

        <ul class="trip-events__list"></ul>
      </li>`);
  }
}
