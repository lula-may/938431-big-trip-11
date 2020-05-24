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

export {getUniqueDates};
