import { describe, test, expect } from 'vitest';
import { validateMobile, validatePincode, validateRequired } from '../utils/validators';

describe('Validators', () => {
  test('valid 10-digit mobile → true', () => expect(validateMobile('9876543210')).toBe(true));
  test('9-digit mobile → false', () => expect(validateMobile('987654321')).toBe(false));
  test('mobile with letters → false', () => expect(validateMobile('987654321A')).toBe(false));

  test('valid 6-digit pincode → true', () => expect(validatePincode('500001')).toBe(true));
  test('5-digit pincode → false', () => expect(validatePincode('50000')).toBe(false));

  test('non-empty string → true', () => expect(validateRequired('hello')).toBe(true));
  test('empty string → false', () => expect(validateRequired('')).toBe(false));
  test('null → false', () => expect(validateRequired(null)).toBe(false));
  test('whitespace → false', () => expect(validateRequired('   ')).toBe(false));
});
