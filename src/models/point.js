export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = data[`type`];
    this.dateFrom = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.dateTo = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.destination = data[`destination`];
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.isFavorite = data[`is_favorite`];
  }

  static parsePoint(point) {
    return new Point(point);
  }

  static parsePoints(points) {
    return points.map(Point.parsePoint);
  }
}
