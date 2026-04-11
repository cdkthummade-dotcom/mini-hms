export function validateMobile(val) {
  return /^\d{10}$/.test(val);
}

export function validatePincode(val) {
  return /^\d{6}$/.test(val);
}

export function validateRequired(val) {
  return val !== null && val !== undefined && String(val).trim() !== '';
}
