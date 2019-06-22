import format from 'date-fns/format';

export function blank(str) {
  return str === null || /^\s*$/.test(str);
}

export function validNumber(str) {
  return /^[+-]?\d*(\.\d+)?$/.test(str);
}

export function dateStr(date) {
  return format(date, 'YYYY-MM-DD');
}
