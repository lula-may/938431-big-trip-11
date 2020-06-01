import AbstractComponent from "./abstract-component.js";
import {getHeaderInfo} from "../utils/components-data.js";

export default class HeaderInfo extends AbstractComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
  }

  getTemplate() {
    const points = this._pointsModel.getAllPoints();
    const info = getHeaderInfo(points);
    const {totalCost, tripTitle, tripDates} = info;
    return (
      `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${tripTitle}</h1>

          <p class="trip-info__dates">${tripDates}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
        </p>
      </section>`
    );
  }
}
