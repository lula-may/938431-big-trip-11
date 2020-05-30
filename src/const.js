const MEANS_OF_TRANSPORT = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const PLACES = [`check-in`, `sightseeing`, `restaurant`];
const EVENT_TYPES = [...MEANS_OF_TRANSPORT, ...PLACES];
const HIDDEN_CLASS = `visually-hidden`;

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

export {MEANS_OF_TRANSPORT, PLACES, EVENT_TYPES, HIDDEN_CLASS, SortType, FilterType};
