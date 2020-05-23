import AbstractComponent from "./abstract-component.js";
import {capitalizeFirstLetter} from "../utils/common.js";

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

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
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  getTemplate() {
    return getFilterTemplate(this._activeFilter);
  }
}
