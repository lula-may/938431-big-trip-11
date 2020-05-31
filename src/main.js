import BoardController from "./controllers/board-controller.js";
import FilterController from "./controllers/filter.js";
import HeaderController from "./controllers/header.js";

import MainNavComponent, {MenuItem} from "./components/main-nav.js";
import StatisticsComponent from "./components/stats.js";

import DestinationsModel from "./models/destinations.js";
import PointsModel from "./models/points.js";
import {render} from "./utils/render.js";
import {generatePoints, generateDestinations} from "./mock/point.js";
import {FilterType} from "./const.js";

const POINTS_AMOUNT = 10;

const headerContainerElement = document.querySelector(`.trip-main`);
const headerControlsElement = headerContainerElement.querySelector(`.trip-main__trip-controls`);
const bodyContainerElement = document.querySelector(`.page-body__page-main .page-body__container`);
const mainContainerElement = document.querySelector(`.trip-events`);
const addNewButtonElement = document.querySelector(`.trip-main__event-add-btn`);

const mainNavComponent = new MainNavComponent();
const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();

const points = generatePoints(POINTS_AMOUNT);
const destinations = generateDestinations();
pointsModel.setPoints(points);
destinationsModel.setDestinations(destinations);

const headerController = new HeaderController(headerContainerElement, pointsModel);
const statisticsComponent = new StatisticsComponent(pointsModel);
const filterController = new FilterController(headerControlsElement, pointsModel);
const boardController = new BoardController(mainContainerElement, pointsModel, destinationsModel);

headerController.render();
render(headerControlsElement, mainNavComponent);
filterController.render();
boardController.render();
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

