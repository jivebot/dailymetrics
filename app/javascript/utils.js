import { addDays, format} from 'date-fns';

export function blank(str) {
  return str === null || /^\s*$/.test(str);
}

export function validNumber(str) {
  return /^[+-]?\d*(\.\d+)?$/.test(str);
}

export function dateStr(date) {
  return format(date, 'YYYY-MM-DD');
}

export function datesEndingOn(date, count) {
  let dates = [];
  for (let i = 0; i < count; i++) {
    dates.push(addDays(date, i - count + 1));
  }
  return dates;
}
