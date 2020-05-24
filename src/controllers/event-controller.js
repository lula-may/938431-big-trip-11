import EventComponent from "../components/event.js";
import {render} from "../utils/render.js";

export default class EventController {
  constructor(container) {
    this._container = container;
    this._eventComponent = null;

    this._event = null;
  }

  render(event) {
    this._event = event;
    this._eventComponent = new EventComponent(event);
    render(this._container, this._eventComponent);
  }

}
