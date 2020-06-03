export default class Destination {
  constructor(data) {
    this.name = data[`name`];
    this.description = data[`description`];
    this.pictures = this._parsePictures(data[`pictures`]);
  }

  convertToRaw() {
    return {
      "name": this.name,
      "description": this.description,
      "pictures": this._getRawPictures()
    };
  }

  _parsePictures(pictures) {
    return pictures.map((picture) => {
      return {
        src: picture[`src`],
        description: picture[`description`]
      };
    });
  }

  _getRawPictures() {
    return this.pictures.map((picture) => {
      return {
        "src": picture.src,
        "description": picture.description
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
