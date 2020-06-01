import AbstractComponent from "./abstract-component.js";
import {capitalizeFirstLetter} from "../utils/common.js";
import {FilterType} from "../const.js";

const FILTER_PREFIX = `filter-`;
const getFiltersMarkup = (activeFilter) => {
  const filters = Object.values(FilterType);
  return filters
    .map((filter) => {
      const isActiveFilter = filter === activeFilter;
      const filterName = capitalizeFirstLetter(filter);
      return `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
          value="${filter}" ${isActiveFilter ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filterName}</label>
        </div>`;
    })
    .join(`\n`);
};

const getFilterTemplate = (activeFilter) => {
  const filtersMarkup = getFiltersMarkup(activeFilter);
  return (
    `<div>
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filtersMarkup}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(activeFilter) {
    super();
    this._activeFilter = activeFilter;
  }

  getTemplate() {
    return getFilterTemplate(this._activeFilter);
  }

  setFilterChangeHandler(handler) {
    this.getElement().querySelector(`.trip-filters`)
      .addEventListener(`change`, (evt) => {
        const newFilter = evt.target.value;
        this._activeFilter = newFilter;
        handler(newFilter);
      });
  }

  resetActiveFilter() {
    const oldActiveElement = this.getElement().querySelector(`.trip-filters__filter-input:checked`);
    oldActiveElement.checked = false;
    this._activeFilter = FilterType.EVERYTHING;
    const newActiveElement = this.getElement().querySelector(`#${FILTER_PREFIX}${FilterType.EVERYTHING}`);
    newActiveElement.checked = true;
  }

  disableFilter(filter) {
    this.getElement().querySelector(`#${FILTER_PREFIX}${filter}`).disabled = true;
  }
}
