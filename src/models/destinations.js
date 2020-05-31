export default class Destinations {
  constructor() {
    this._destinations = [];
  }

  getDestinations() {
    return this._destinations;
  }

  setDestinations(destinations) {
    this._destinations = destinations;
  }

  getDestinationByName(name) {
    return this._destinations.find((item) => item.name === name);
  }
}
