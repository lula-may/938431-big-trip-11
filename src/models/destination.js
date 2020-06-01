export default class Destination {
  constructor(data) {
    this.name = data[`name`];
    this.description = data[`description`];
    this.pictures = this._parsePictures(data[`pictures`]);
  }

  _parsePictures(pictures) {
    return pictures.map((picture) => {
      return {
        src: picture[`src`],
        description: picture[`description`]
      };
    });
  }

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(destinations) {
    return destinations.map(Destination.parseDestination);
  }
}
