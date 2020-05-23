import FilterComponent from "./components/filter.js";
import HeaderInfoComponent from "./components/header-info.js";
import MainNavComponent from "./components/main-nav.js";
import SortComponent from "./components/sort.js";
import {RenderPosition, render} from "./utils/render.js";

const headerContainerElement = document.querySelector(`.trip-main`);
const headerControlsElement = headerContainerElement.querySelector(`.trip-main__trip-controls`);
const mainContainerElement = document.querySelector(`.trip-events`);

const headerInfoComponent = new HeaderInfoComponent();
const mainNavComponent = new MainNavComponent();
const filterComponent = new FilterComponent();
const sortComponent = new SortComponent();

render(headerContainerElement, headerInfoComponent, RenderPosition.AFTERBEGIN);
render(headerControlsElement, mainNavComponent);
render(headerControlsElement, filterComponent);
render(mainContainerElement, sortComponent);
