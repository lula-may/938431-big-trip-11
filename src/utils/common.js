const capitalizeFirstLetter = (word) => {
  const firstLetter = word.slice(0, 1);
  return word.replace(firstLetter, firstLetter.toUpperCase());
};

export {capitalizeFirstLetter};
