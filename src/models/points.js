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
}
