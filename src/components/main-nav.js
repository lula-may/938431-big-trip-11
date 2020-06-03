import AbstractComponent from "./abstract-component.js";

const ACTIVE_CLASS = `trip-tabs__btn--active`;

export const MenuItem = {
  TABLE: `table`,
  STATS: `stats`
};

export default class MainNav extends AbstractComponent {
  constructor() {
    super();
    this._activeItem = MenuItem.TABLE;
  }

  getTemplate() {
    return (
      `<div>
        <h2 class="visually-hidden">Switch trip view</h2>
        <nav class="trip-controls__trip-tabs  trip-tabs">
          <a class="trip-tabs__btn  trip-tabs__btn--active" id="table" href="#">Table</a>
          <a class="trip-tabs__btn" href="#" id="stats">Stats</a>
        </nav>
      </div>`
    );
  }

  setActiveItem(id) {
    if (this._activeItem === id) {
      return;
    }
    const oldActiveItem = this.getElement().querySelector(`#${this._activeItem}`);
    const newActiveItem = this.getElement().querySelector(`#${id}`);
    this._activeItem = id;
    oldActiveItem.classList.remove(ACTIVE_CLASS);
    newActiveItem.classList.add(ACTIVE_CLASS);
  }

  setChangeHandler(handler) {
    this.getElement().querySelector(`nav`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `A` && evt.target.id === this._activeItem) {
          return;
        }
        handler(evt.target.id);
      });
  }
}
