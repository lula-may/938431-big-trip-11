import {SortType} from "../const.js";
const getUniqueDates = (points) => {
  return points.filter((point, i) => {
    const date = point.dateFrom.getDate();
    const index = points.findIndex((it) => it.dateFrom.getDate() === date);
    return index === i;
  })
  .map((point) => point.dateFrom)
  .sort((left, right) => {
    return left - right;
  });
};

const getDuration = (point) => {
  return point.dateTo - point.dateFrom;
};

const getSortedPoints = (points, type) => {
  let sortedPoints = [];
  switch (type) {
    case SortType.PRICE:
      sortedPoints = points.sort((left, right) => {
        return right.price - left.price;
      });
      break;
    case SortType.TIME:
      sortedPoints = points.sort((left, right) => {
        return getDuration(right) - getDuration(left);
      });
      break;
    default: break;
  }
  return sortedPoints;
};

export {getUniqueDates, getSortedPoints};
