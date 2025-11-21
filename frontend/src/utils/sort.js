export const compareStrings = (a, b) => {
  return a.localeCompare(b);
};

export const compareNumbers = (a, b) => {
  return a - b;
};

export default { compareStrings, compareNumbers };
