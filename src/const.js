const TRANSPORTS = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const PLACES = [`check-in`, `sightseeing`, `restaurant`];
const EVENT_TYPES = [...TRANSPORTS, ...PLACES];

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export {TRANSPORTS, PLACES, EVENT_TYPES, SortType};
