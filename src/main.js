import BoardController from "./controllers/board-controller.js";
import FilterComponent from "./components/filter.js";
import HeaderInfoComponent from "./components/header-info.js";
import MainNavComponent from "./components/main-nav.js";
import PointsModel from "./models/points.js";
import {RenderPosition, render} from "./utils/render.js";
import {generatePoints, allDestinations} from "./mock/point.js";

const POINTS_AMOUNT = 10;

const headerContainerElement = document.querySelector(`.trip-main`);
const headerControlsElement = headerContainerElement.querySelector(`.trip-main__trip-controls`);
const mainContainerElement = document.querySelector(`.trip-events`);

const headerInfoComponent = new HeaderInfoComponent();
const mainNavComponent = new MainNavComponent();
const filterComponent = new FilterComponent();
const pointsModel = new PointsModel();
const points = generatePoints(POINTS_AMOUNT);
pointsModel.setPoints(points);

render(headerContainerElement, headerInfoComponent, RenderPosition.AFTERBEGIN);
render(headerControlsElement, mainNavComponent);
render(headerControlsElement, filterComponent);
const boardController = new BoardController(mainContainerElement, pointsModel, allDestinations);
boardController.render();

