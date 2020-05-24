import EditEventComponent from "../components/edit-event.js";
import EventComponent from "../components/event.js";
import {render} from "../utils/render.js";

export default class EventController {
  constructor(container) {
    this._container = container;
    this._eventComponent = null;
    this._editEventComponent = null;

    this._event = null;
  }

  render(event, index) {
    this._event = event;
    this._eventComponent = new EventComponent(event);
    this._editEventComponent = new EditEventComponent(event, index);
    render(this._container, this._eventComponent);
  }

}
