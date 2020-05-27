import FilterComponent from "../components/filter.js";
import {FilterType} from "../const";
import {render} from "../utils/render.js";

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
  }

  render() {
    this._filterComponent = new FilterComponent();
    render(this._container, this._filterComponent);
    this._filterComponent.setFilterChangeHandler(this._onFilterTypeChange);
  }

  resetActiveFilter() {
    this._activeFilter = FilterType.EVERYTHING;
  }

  _onFilterTypeChange(type) {
    this._activeFilter = type;
    this._pointsModel.setFilter(type);
  }
}
