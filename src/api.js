import Point from "./models/point.js";
import Destination from "./models/destination.js";
import Offer from "./models/offer.js";

const URL = {
  POINTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`,
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

export default class API {
  constructor(authorization, endPoint) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getPoints() {
    return this._load({url: URL.POINTS})
      .then((response) => response.json())
      .then(Point.parsePoints);
  }

  getDestinations() {
    return this._load({url: URL.DESTINATIONS})
    .then((response) => response.json())
    .then(Destination.parseDestinations);
  }

  getOffers() {
    return this._load({url: URL.OFFERS})
    .then((response) => response.json())
    .then(Offer.parseOffers);
  }

  updatePoint(id, point) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    headers.append(`Content-type`, `application/json`);
    return this._load({
      url: `${URL.POINTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(point.convertToRaw()),
      headers
    })
    .then((response) => response.json())
    .then(Point.parsePoint);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
