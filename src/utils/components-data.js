import {SortType} from "../const.js";
import {formatDatesInterval} from "./common.js";

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

const getTotalCost = (points) => {
  return points.length
    ? points.map((item) => item.price)
      .reduce((acc, value) => {
        acc += value;
        return acc;
      }, 0)
    : 0;
};

const getTripTitle = (points) => {
  if (!points.length) {
    return ``;
  }
  const titles = points.map((point) => point.destination.name);
  const notRepeatingTitles = titles.filter((item, i, items) => item !== items[i - 1]);
  const number = notRepeatingTitles.length;
  return (number > 3)
    ? `${notRepeatingTitles[0]} &mdash; &hellip; &mdash; ${notRepeatingTitles[number - 1]}`
    : notRepeatingTitles.join(` &mdash; `);
};

const getDatesIntervalText = (points) => {
  if (!points.length) {
    return ``;
  }

  const dateFrom = points[0].dateFrom;
  const dateTo = points[points.length - 1].dateTo;
  return formatDatesInterval(dateFrom, dateTo);
};

const getHeaderInfo = (points) => {
  return {
    totalCost: getTotalCost(points),
    tripTitle: getTripTitle(points),
    tripDates: getDatesIntervalText(points)
  };
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

export {getUniqueDates, getSortedPoints, getHeaderInfo};
