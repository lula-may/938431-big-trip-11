const MEANS_OF_TRANSPORT = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const PLACES = [`check-in`, `sightseeing`, `restaurant`];
const EVENT_TYPES = [...MEANS_OF_TRANSPORT, ...PLACES];

const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`
};

export {MEANS_OF_TRANSPORT, PLACES, EVENT_TYPES, SortType};
