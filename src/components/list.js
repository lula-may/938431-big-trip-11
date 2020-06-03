import AbstractComponent from "./abstract-component.js";

export default class List extends AbstractComponent {
  getTemplate() {
    return `<ul class="trip-days"></ul>`;
  }
}
