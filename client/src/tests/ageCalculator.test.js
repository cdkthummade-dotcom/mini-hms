import { describe, test, expect } from 'vitest';
import { calculateAge, formatDate, formatDateTime } from '../utils/ageCalculator';

describe('calculateAge', () => {
  test('today → 0 0 0', () => {
    const today = new Date().toISOString().split('T')[0];
    const r = calculateAge(today);
    expect(r.years).toBe(0);
    expect(r.months).toBe(0);
    expect(r.days).toBe(0);
  });

  test('null DOB → empty display', () => {
    const r = calculateAge(null);
    expect(r.display).toBe('');
    expect(r.years).toBe(0);
  });

  test('future DOB → null (invalid)', () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    const r = calculateAge(d.toISOString().split('T')[0]);
    expect(r).toBeNull();
  });

  test('1990 DOB → display string has Yrs Mo Days', () => {
    const r = calculateAge('1990-06-15');
    expect(r.display).toContain('Yrs');
    expect(r.display).toContain('Mo');
    expect(r.display).toContain('Days');
  });
});

describe('formatDate', () => {
  test('formats as DD-MM-YYYY', () => {
    expect(formatDate('2026-04-10')).toBe('10-04-2026');
  });

  test('null → empty string', () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('formatDateTime', () => {
  test('null → empty string', () => {
    expect(formatDateTime(null)).toBe('');
  });

  test('returns valid string with AM/PM', () => {
    const result = formatDateTime('2026-04-10T09:00:00Z');
    expect(result).toMatch(/AM|PM/);
  });
});
