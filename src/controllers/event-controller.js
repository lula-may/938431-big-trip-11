import EditEventComponent from "../components/edit-event.js";
import EventComponent from "../components/event.js";
import {render} from "../utils/render.js";
import {offersByType} from "../mock/point.js";

export default class EventController {
  constructor(container) {
    this._container = container;
    this._eventComponent = null;
    this._editEventComponent = null;

    this._event = null;
    this._offers = [];
  }

  render(event, index) {
    this._event = event;
    this._offers = offersByType[event.type];
    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EditEventComponent(event, index, this._offers);
    render(this._container, this._eventComponent);
  }

}
