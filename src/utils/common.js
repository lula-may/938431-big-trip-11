import moment from "moment";
import {MEANS_OF_TRANSPORT} from "../const.js";

const capitalizeFirstLetter = (word) => {
  const firstLetter = word.slice(0, 1);
  return word.replace(firstLetter, firstLetter.toUpperCase());
};

const isPositive = (value) => value > 0;
const stringifyNumber = (number) => {
  return number < 10 ? `0${number}` : `${number}`;
};

const formatDurationTime = (duration) => {
  const runTime = moment.duration(duration, `minutes`);
  const days = runTime.days();
  const hours = stringifyNumber(runTime.hours());
  const minutes = stringifyNumber(runTime.minutes());

  if (isPositive(days)) {
    return `${stringifyNumber(days)}D ${hours}H ${minutes}M`;
  }
  return `${isPositive(hours) ? `${hours}H ` : ``}${minutes}M`;
};

const formatFullDate = (date) => {
  return moment(date).format(`DD/MM/YY HH:mm`);
};

const transportEvents = new Set(MEANS_OF_TRANSPORT);

const getEventDescription = (type, place) => {
  const typeString = capitalizeFirstLetter(type);
  const placeString = place || ``;
  if (transportEvents.has(type)) {
    return `${typeString} to ${placeString}`;
  }
  return `${typeString} in ${placeString}`;
};


export {capitalizeFirstLetter, formatDurationTime, formatFullDate, getEventDescription};
