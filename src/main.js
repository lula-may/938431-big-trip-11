import API from "./api.js";
import BoardController from "./controllers/board-controller.js";
import FilterController from "./controllers/filter.js";
import HeaderController from "./controllers/header.js";

import MainNavComponent, {MenuItem} from "./components/main-nav.js";
import StatisticsComponent from "./components/stats.js";

import DestinationsModel from "./models/destinations.js";
import OffersModel from "./models/offers.js";
import PointsModel from "./models/points.js";

import {render} from "./utils/render.js";
import {FilterType} from "./const.js";

const AUTHORIZATION = `Basic O8eU4-mx&qlpg`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const headerContainerElement = document.querySelector(`.trip-main`);
const headerControlsElement = headerContainerElement.querySelector(`.trip-main__trip-controls`);
const bodyContainerElement = document.querySelector(`.page-body__page-main .page-body__container`);
const mainContainerElement = document.querySelector(`.trip-events`);
const addNewButtonElement = document.querySelector(`.trip-main__event-add-btn`);

const api = new API(AUTHORIZATION, END_POINT);
const mainNavComponent = new MainNavComponent();
const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();

const headerController = new HeaderController(headerContainerElement, pointsModel);
const statisticsComponent = new StatisticsComponent(pointsModel);
const filterController = new FilterController(headerControlsElement, pointsModel);
const boardController = new BoardController(mainContainerElement, pointsModel, destinationsModel, offersModel, api);

headerController.render();
render(headerControlsElement, mainNavComponent);
filterController.render();
render(bodyContainerElement, statisticsComponent);
statisticsComponent.hide();

mainNavComponent.setChangeHandler((menuItem) => {
  mainNavComponent.setActiveItem(menuItem);
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      boardController.show();
      break;
    case MenuItem.STATS:
      boardController.hide();
      boardController.resetSort();
      statisticsComponent.rerender();
      statisticsComponent.show();
      break;
  }
});

addNewButtonElement.addEventListener(`click`, () => {
  addNewButtonElement.disabled = true;
  filterController.resetActiveFilter();
  pointsModel.setFilter(FilterType.EVERYTHING);
  mainNavComponent.setActiveItem(MenuItem.TABLE);
  statisticsComponent.hide();
  boardController.show();
  boardController.createEvent();
});

Promise.all([
  api.getPoints()
    .then((points) => pointsModel.setPoints(points)),
  api.getDestinations()
    .then((destinations) => destinationsModel.setDestinations(destinations)),
  api.getOffers()
    .then((offers) => offersModel.setOffers(offers))
])
.then(() => {
  filterController.render();
  headerController.render();
  boardController.render();
});

