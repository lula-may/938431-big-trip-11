const sortPointsByDate = (points) => {
  const sortedPoints = points.slice();
  return sortedPoints.sort((left, right) => {
    return left.dateFrom - right.dateFrom;
  });
};

export default class Points {
  constructor() {
    this._points = [];
  }

  setPoints(points) {
    this._points = sortPointsByDate(points);
  }

  getPoints() {
    return this._points;
  }

  getPointsByDate(date) {
    const points = this._points.filter((point) => point.dateFrom.getDate() === date.getDate());
    return sortPointsByDate(points);
  }

  updatePoint(id, newPoint) {
    const index = this._points.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), newPoint, this._points.slice(index + 1));
    return true;
  }
}
