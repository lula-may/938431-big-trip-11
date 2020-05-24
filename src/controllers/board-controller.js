import DayComponent from "../components/day.js";
import EventController from "./event-controller.js";
import ListComponent from "../components/list.js";
import SortComponent from "../components/sort.js";
import {render} from "../utils/render.js";
import {getUniqueDates} from "../utils/components-data.js";
import {SortType} from "../const.js";

export default class BoardController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._listComponent = new ListComponent();
    this._sortComponent = new SortComponent();
    this._showedPointsControllers = [];
    this._activeSort = SortType.EVENT;
  }

  render() {
    const points = this._pointsModel.getPoints();
    render(this._container, this._sortComponent);
    render(this._container, this._listComponent);

    const listContainerElement = this._listComponent.getElement();
    const tripDates = getUniqueDates(points);
    let count = 1;
    tripDates.forEach((date) => {
      const dayComponent = new DayComponent(count, date, this._activeSort);
      render(listContainerElement, dayComponent);
      const pointsContainer = dayComponent.getElement().querySelector(`.trip-events__list`);
      // Получаем список событий дня
      const pointsByDay = this._pointsModel.getPointsByDate(date);
      count++;
      // Для каждого события:
      pointsByDay.forEach((point) => {
        // - Создать контроллер
        const newController = new EventController(pointsContainer);
        newController.render(point);
        this._showedPointsControllers.push(newController);
      });
    });
  }
}
