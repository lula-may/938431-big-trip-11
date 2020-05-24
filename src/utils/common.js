import moment from "moment";
import {MEANS_OF_TRANSPORT} from "../const.js";

const capitalizeFirstLetter = (word) => {
  const firstLetter = word.slice(0, 1);
  return word.replace(firstLetter, firstLetter.toUpperCase());
};

const formatDurationTime = (duration) => {
  const runTime = moment.duration(duration, `minutes`);
  const hours = runTime.hours();
  const isHour = hours > 0;
  const minutes = runTime.minutes();
  return `${isHour ? `${hours}H ` : ``}${minutes}M`;
};

const formatFullDate = (date) => {
  return moment(date).format(`DD/MM/YY HH:mm`);
};

const transportEvents = new Set(MEANS_OF_TRANSPORT);

const getEventDescription = (type, place) => {
  const placeString = place || ``;
  if (transportEvents.has(type)) {
    return `${type} to ${placeString}`;
  }
  return `${type} in ${placeString}`;
};


export {capitalizeFirstLetter, formatDurationTime, formatFullDate, getEventDescription};
