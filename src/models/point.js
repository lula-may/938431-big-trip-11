import Destination from "./destination.js";

export default class Point {
  constructor(data) {
    this.id = data[`id`] || ``;
    this.type = data[`type`];
    this.dateFrom = data[`date_from`] ? new Date(data[`date_from`]) : null;
    this.dateTo = data[`date_to`] ? new Date(data[`date_to`]) : null;
    this.destination = Destination.parseDestination(data[`destination`]);
    this.price = data[`base_price`];
    this.offers = data[`offers`];
    this.isFavorite = data[`is_favorite`];
  }

  convertToRaw() {
    return {
      "type": this.type,
      "date_from": this.dateFrom.toISOString(),
      "date_to": this.dateTo.toISOString(),
      "destination": this.destination.convertToRaw(),
      "base_price": this.price,
      "offers": this.offers,
      "is_favorite": this.isFavorite
    };
  }

  static parsePoint(point) {
    return new Point(point);
  }

  static parsePoints(points) {
    return points.map(Point.parsePoint);
  }

  static clone(point) {
    return new Point(point.convertToRaw());
  }
}
