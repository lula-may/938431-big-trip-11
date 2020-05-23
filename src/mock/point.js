const POINT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
const DESTINATIONS = [`Chamonix`, `Geneva`, `Amsterdam`];
const DESCRIPTION_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const OPTIONS = [`Choose radio station`, `Add meal`, `Choose seats`, `Add luggage`, `Travel by train`, `Switch to comfort class`, `Coffee to bed`];
const BEGINING_DELAY = 7;
const TRIP_DURATION_IN_MINUTES = 3 * 24 * 60;
const MIN_DURATION_IN_MINUTES = 30;
const MAX_DURATION_IN_MINUTES = 150;
const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = MINUTES_IN_HOUR * 24;
const DESCRIPTION_MIN_SENTENCES = 1;
const DESCRIPTION_MAX_SENTENCES = 5;
const MIN_OPTION_PRICE = 5;
const MAX_OPTION_PRICE = 150;

const getPictures = () => {
  const pictures = [];
  const amount = getRandomInteger(0, 5);
  if (amount > 0) {
    for (let i = 1; i <= amount; i++) {
      const picture = {};
      picture.src = `./public/img/photos/${i}.jpg`;
      picture.description = `Picture description`;
      pictures.push(picture);
    }
  }
  return pictures;
};

const getRandomOffers = () => {
  const amount = getRandomInteger(0, OPTIONS.length);
  const offers = [];
  if (amount > 0) {
    for (let i = 1; i <= amount; i++) {
      const offer = {};
      offer.title = getRandomItem(OPTIONS);
      offer.price = getRandomInteger(MIN_OPTION_PRICE, MAX_OPTION_PRICE);
      offers.push(offer);
    }
  }
  return offers;
};

const getRandomInteger = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

const getRandomItem = (items) => {
  const randomIndex = getRandomInteger(0, items.length - 1);
  return items[randomIndex];
};

const getRandomItems = (items, amount) => {
  const subList = [];
  const copiedItems = items.slice();
  for (let i = 0; i <= amount; i++) {
    const randomIndex = getRandomInteger(0, copiedItems.length - 1);
    const newItem = copiedItems.splice(randomIndex, 1);
    subList.push(newItem);
  }
  return subList;
};

const minDate = new Date();
minDate.setDate(minDate.getDate() + BEGINING_DELAY);

const getRandomStartDate = () => {
  const date = new Date(minDate);
  const startInterval = getRandomInteger(0, TRIP_DURATION_IN_MINUTES);
  const days = Math.trunc(startInterval / MINUTES_IN_DAY);
  const totalMinutes = startInterval % MINUTES_IN_DAY;
  const hours = Math.trunc(totalMinutes / MINUTES_IN_HOUR);
  const minutes = totalMinutes % MINUTES_IN_HOUR;

  date.setDate(date.getDate() + days);
  const newHours = date.getHours() + hours;
  date.setHours(newHours, minutes);
  return date;
};

const sentences = DESCRIPTION_TEXT.split(`. `).map((item) => item.endsWith(`.`) ? item : `${item}.`);

const getDestinationDescription = () => {
  const descriptionLength = getRandomInteger(DESCRIPTION_MIN_SENTENCES, DESCRIPTION_MAX_SENTENCES);
  const descriptions = getRandomItems(sentences, descriptionLength);
  return descriptions.join(` `);
};


const getPoint = () => {
  const dateFrom = getRandomStartDate();
  const dateTo = new Date(dateFrom);
  dateTo.setMinutes(dateFrom.getMinutes() + getRandomInteger(MIN_DURATION_IN_MINUTES, MAX_DURATION_IN_MINUTES));
  const isDescription = Math.random() > 0.5;
  return {
    type: getRandomItem(POINT_TYPES),
    dateFrom,
    dateTo,
    destinationName: isDescription ? getRandomItem(DESTINATIONS) : ``,
    destinationDescription: isDescription ? getDestinationDescription() : ``,
    destinationPicures: isDescription ? getPictures() : null,
    offers: getRandomOffers(),
    isFavorite: Math.random() > 0.5
  };
};

const generatePoints = (amount) => {
  const points = [];
  for (let i = 1; i <= amount; i++) {
    points.push(getPoint());
  }
  return points;
};

export {generatePoints};
