export default class Offers {
  constructor() {
    this._offers = [];
  }

  setOffers(offers) {
    this._offers = offers;
  }

  getOffers() {
    return this._offers;
  }

  getOffersByType(type) {
    return this._offers.find((item) => item.type === type);
  }
}
