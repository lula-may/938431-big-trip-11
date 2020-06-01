import FilterComponent from "../components/filter.js";
import {FilterType} from "../const";
import {render, replace} from "../utils/render.js";

const today = new Date();

const getFuturePoints = (points) => {
  return points.slice().filter((point) => point.dateTo > today);
};

const getPastPoints = (points) => {
  return points.slice().filter((point) => point.dateTo <= today);
};

export const getPointsByFilter = (points, filter) => {
  let filteredPoints = [];
  switch (filter) {
    case FilterType.FUTURE:
      filteredPoints = getFuturePoints(points);
      break;
    case FilterType.PAST:
      filteredPoints = getPastPoints(points);
      break;
    default:
      filteredPoints = points.slice();
  }
  return filteredPoints;
};

export default class Filter {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._activeFilter = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const allPoints = this._pointsModel.getAllPoints();
    const areNoFuturePoints = !getFuturePoints(allPoints).length;
    const areNoPastPoints = !getPastPoints(allPoints).length;
    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(this._activeFilter);
    if (areNoFuturePoints) {
      this._filterComponent.disableFilter(FilterType.FUTURE);
    }
    if (areNoPastPoints) {
      this._filterComponent.disableFilter(FilterType.PAST);
    }
    this._filterComponent.setFilterChangeHandler(this._onFilterTypeChange);
    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
      return;
    }
    render(this._container, this._filterComponent);
  }

  resetActiveFilter() {
    this._activeFilter = FilterType.EVERYTHING;
    this.render();
  }

  _onFilterTypeChange(type) {
    this._activeFilter = type;
    this._pointsModel.setFilter(type);
  }

  _onDataChange() {
    this.render();
  }
}
