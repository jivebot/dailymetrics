export function blank(str) {
  return str === null || /^\s*$/.test(str);
}

export function validNumber(str) {
  return /^[+-]?\d*(\.\d+)?$/.test(str);
}
