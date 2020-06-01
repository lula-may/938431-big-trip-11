export default class Offer {
  constructor(data) {
    this.type = data[`type`];
    this.offers = this._getOffers(data[`offers`]);
  }

  _getOffers(items) {
    return items.map((item) => {
      return {
        title: item[`title`],
        price: item[`price`]
      };
    });
  }

  static parseOffer(offer) {
    return new Offer(offer);
  }

  static parseOffers(offers) {
    return offers.map(Offer.parseOffer);
  }
}
