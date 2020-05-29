import {FilterType} from "../const.js";
import {getPointsByFilter} from "../controllers/filter.js";

const sortPointsByDate = (points) => {
  const sortedPoints = points.slice();
  return sortedPoints.sort((left, right) => {
    return left.dateFrom - right.dateFrom;
  });
};

export default class Points {
  constructor() {
    this._points = [];
    this._activeFilter = FilterType.EVERYTHING;

    this._onFilterChange = null;
  }

  setPoints(points) {
    this._points = sortPointsByDate(points);
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilter);
  }

  getPointsByDate(date) {
    const points = this.getPoints().filter((point) => point.dateFrom.getDate() === date.getDate());
    return sortPointsByDate(points);
  }

  updatePoint(id, newPoint) {
    const index = this._points.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    this._points = [...this._points.slice(0, index), newPoint, ...this._points.slice(index + 1)];
    return true;
  }

  deletePoint(id) {
    const index = this._points.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }
    this._points = [...this._points.slice(0, index), ...this._points.slice(index + 1)];
    return true;
  }

  addPoint(event) {
    this._points.push(event);
  }

  setFilter(filter) {
    this._activeFilter = filter;
    this._callHandler(this._onFilterChange);
  }

  setFilterChangeHandler(handler) {
    this._onFilterChange = handler;
  }

  _callHandler(handler) {
    handler();
  }
}
