import moment from "moment";

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

export {capitalizeFirstLetter, formatDurationTime};
