import AbstractComponent from "./abstract-component.js";
import {capitalizeFirstLetter} from "../utils/common.js";
import {SortType} from "../const.js";

const SORT_PREFIX = `sort-`;
const getSortMarkup = (activeSort) => {
  const items = Object.values(SortType);
  return items
    .map((sort) => {
      const isActiveSort = sort === activeSort;
      const isDefaultSort = sort === SortType.EVENT;
      const sortName = capitalizeFirstLetter(sort);
      return (
        `<div class="trip-sort__item  trip-sort__item--${sort}">
          <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
            value="sort-${sort}" ${isActiveSort ? `checked` : ``}>
          <label class="trip-sort__btn" for="sort-${sort}">
            ${sortName}
            ${isDefaultSort
          ? ``
          : `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
              <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
            </svg>`}
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const getSortingTemplate = (activeSort) => {
  const sortListMarkup = getSortMarkup(activeSort);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>
    ${sortListMarkup}
    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
  </form>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();
    this._activeSort = SortType.EVENT;
  }

  getTemplate() {
    return getSortingTemplate(this._activeSort);
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const sortType = evt.target.id.replace(SORT_PREFIX, ``);
      if (sortType === this._activeSort) {
        return;
      }
      this._activeSort = sortType;
      handler(sortType);
    });
  }
}
