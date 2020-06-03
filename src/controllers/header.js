import HeaderInfoComponent from "../components/header-info.js";
import {render, replace, RenderPosition} from "../utils/render.js";

export default class Header {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._headerComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const oldComponent = this._headerComponent;
    this._headerComponent = new HeaderInfoComponent(this._pointsModel);
    if (oldComponent) {
      replace(this._headerComponent, oldComponent);
    } else {
      render(this._container, this._headerComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onDataChange() {
    this.render();
  }
}
