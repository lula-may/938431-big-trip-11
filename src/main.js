import BoardController from "./controllers/board-controller.js";
import FilterController from "./controllers/filter.js";
import HeaderInfoComponent from "./components/header-info.js";
import MainNavComponent from "./components/main-nav.js";
import PointsModel from "./models/points.js";
import {RenderPosition, render} from "./utils/render.js";
import {generatePoints, allDestinations} from "./mock/point.js";
import {FilterType} from "./const.js";

const POINTS_AMOUNT = 10;

const headerContainerElement = document.querySelector(`.trip-main`);
const headerControlsElement = headerContainerElement.querySelector(`.trip-main__trip-controls`);
const mainContainerElement = document.querySelector(`.trip-events`);
const addNewButtonElement = document.querySelector(`.trip-main__event-add-btn`);

const mainNavComponent = new MainNavComponent();
const pointsModel = new PointsModel();
const points = generatePoints(POINTS_AMOUNT);
pointsModel.setPoints(points);
const headerInfoComponent = new HeaderInfoComponent(pointsModel);

render(headerContainerElement, headerInfoComponent, RenderPosition.AFTERBEGIN);
render(headerControlsElement, mainNavComponent);
const filterController = new FilterController(headerControlsElement, pointsModel);
const boardController = new BoardController(mainContainerElement, pointsModel, allDestinations);
filterController.render();
boardController.render();

addNewButtonElement.addEventListener(`click`, () => {
  addNewButtonElement.disabled = true;
  filterController.resetActiveFilter();
  pointsModel.setFilter(FilterType.EVERYTHING);
  boardController.createEvent();
  addNewButtonElement.disabled = false;
});

