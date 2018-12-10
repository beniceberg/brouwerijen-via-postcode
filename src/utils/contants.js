const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

// https://stackoverflow.com/a/17898538/9094722
export const regexNL = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i;
export const regexBE = /^[1-9][0-9]{3}$/i;

export const today = daysOfWeek[new Date().getDay()];
