import DayComponent from "../components/day.js";
import EventController from "./event-controller.js";
import ListComponent from "../components/list.js";
import NoPointsComponent from "../components/no-points.js";
import SortComponent from "../components/sort.js";
import {render, remove} from "../utils/render.js";
import {getUniqueDates, getSortedPoints} from "../utils/components-data.js";
import {SortType, HIDDEN_CLASS} from "../const.js";

const Mode = {
  DEFAULT: `default`,
  ADDING: `adding`
};

const newEventButtonElement = document.querySelector(`.trip-main__event-add-btn`);

export default class BoardController {
  constructor(container, pointsModel, destinationsModel) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._destinationsModel = destinationsModel;
    this._listComponent = null;
    this._sortComponent = new SortComponent();
    this._dayComponents = [];
    this._showedPointsControllers = [];
    this._creatingEvent = null;
    this._mode = Mode.DEFAULT;
    this._activeSort = SortType.EVENT;

    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterTypeChange);
  }

  render() {
    if (!this._pointsModel.getPoints().length) {
      render(this._container, new NoPointsComponent());
      return;
    }

    render(this._container, this._sortComponent);
    this._renderPointsList();
  }

  resetSort() {
    this._activeSort = SortType.EVENT;
    this._sortComponent.setActiveSort(SortType.EVENT);
    this._updatePoints();
  }

  createEvent() {
    this._mode = Mode.ADDING;
    this._creatingEvent = new EventController(this._container, this._destinationsModel, this._onViewChange, this._onDataChange);
    this._removePointsList();
    this._creatingEvent.render(null);
    this._renderPointsList();
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  _renderPoints(container, points) {
    points.forEach((point) => {
      const newController = new EventController(container, this._destinationsModel, this._onViewChange, this._onDataChange);
      newController.render(point);
      this._showedPointsControllers.push(newController);
    });
  }

  _renderPointsList() {
    this._listComponent = new ListComponent();
    render(this._container, this._listComponent);
    const listContainerElement = this._listComponent.getElement();

    switch (this._activeSort) {
      case SortType.EVENT :
        const tripDates = getUniqueDates(this._pointsModel.getPoints());
        let daysCount = 1;
        tripDates.forEach((date) => {
          const dayComponent = new DayComponent(this._activeSort, daysCount, date);
          render(listContainerElement, dayComponent);
          this._dayComponents.push(dayComponent);
          const pointsContainer = dayComponent.getElement().querySelector(`.trip-events__list`);
          // Получаем список событий дня
          const pointsByDay = this._pointsModel.getPointsByDate(date);
          this._renderPoints(pointsContainer, pointsByDay);
          daysCount++;
        });
        break;
      default:
        const dayComponent = new DayComponent(this._activeSort);
        render(listContainerElement, dayComponent);
        this._dayComponents.push(dayComponent);
        const pointsContainer = dayComponent.getElement().querySelector(`.trip-events__list`);
        const sortedPoints = getSortedPoints(this._pointsModel.getPoints(), this._activeSort);
        this._renderPoints(pointsContainer, sortedPoints);
    }
  }

  _removePoints() {
    this._showedPointsControllers.forEach((controller) => controller.destroy());
    this._showedPointsControllers = [];
    this._currentPoints = [];
  }

  _removePointsList() {
    this._removePoints();
    this._dayComponents.forEach((day) => remove(day));
    this._dayComponents = [];
    remove(this._listComponent);
  }

  _updatePoints() {
    this._removePointsList();
    const newPoints = this._pointsModel.getPoints();
    this._renderPointsList(newPoints);
  }

  _onViewChange() {
    this._showedPointsControllers.forEach((controller) => controller.setDefaultView());
    if (this._creatingEvent) {
      this._creatingEvent.destroy();
      this._creatingEvent = null;
      newEventButtonElement.disabled = false;
    }
  }

  _onSortTypeChange(type) {
    this._activeSort = type;
    this._updatePoints();
  }

  _onDataChange(oldData, newData) {
    // Создание новой точки маршрута
    if (this._mode === Mode.ADDING && !oldData.id) {
      if (newData === null) {
        this._creatingEvent.destroy();
        this._updatePoints();
      } else {
        newData.id = Math.round(new Date() * Math.random()).toString();
        this._pointsModel.addPoint(newData);
        this._showedPointsControllers.push(this._creatingEvent);
        this._updatePoints();
      }
      this._creatingEvent = null;
      this._mode = Mode.DEFAULT;
      newEventButtonElement.disabled = false;
      return;
    }
    // Удаление точки маршрута
    if (newData === null) {
      const isSuccess = this._pointsModel.deletePoint(oldData.id);
      if (isSuccess) {
        this._updatePoints();
      }
      return;
    }
    // Редактирование точки маршрута
    const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
    if (isSuccess) {
      this._updatePoints();
    }
  }

  _onFilterTypeChange() {
    this.resetSort();
  }
}
