import DayComponent from "../components/day.js";
import EventController from "./event-controller.js";
import ListComponent from "../components/list.js";
import SortComponent from "../components/sort.js";
import {render, remove} from "../utils/render.js";
import {getUniqueDates, getSortedPoints} from "../utils/components-data.js";
import {SortType} from "../const.js";

export default class BoardController {
  constructor(container, pointsModel, destinations) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._destinations = destinations;
    this._listComponent = new ListComponent();
    this._sortComponent = new SortComponent();
    this._dayComponents = [];
    this._showedPointsControllers = [];
    this._activeSort = SortType.EVENT;

    this._onViewChange = this._onViewChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterTypeChange);
  }

  render() {
    render(this._container, this._sortComponent);
    render(this._container, this._listComponent);
    this._renderPointsList();
  }

  resetSort() {
    this._activeSort = SortType.EVENT;
    this._sortComponent.setActiveSort(SortType.EVENT);
    this._updatePoints();
  }

  _renderPoints(container, points) {
    points.forEach((point) => {
      const newController = new EventController(container, this._destinations, this._onViewChange, this._onDataChange);
      newController.render(point);
      this._showedPointsControllers.push(newController);
    });
  }

  _renderPointsList() {
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
  }

  _updatePoints() {
    this._removePointsList();
    const newPoints = this._pointsModel.getPoints();
    this._renderPointsList(newPoints);
  }

  _onViewChange() {
    this._showedPointsControllers.forEach((controller) => controller.setDefaultView());
  }

  _onSortTypeChange(type) {
    this._activeSort = type;
    this._updatePoints();
  }

  _onDataChange(oldData, newData) {
    // Реализован только случай редактирования
    // Добавить вызов метода render у нужного контроллера
    // Дополнить метод render проверкой на наличие старых компонентов
    this._pointsModel.updatePoint(oldData.id, newData);
  }

  _onFilterTypeChange() {
    this.resetSort();
  }
}
