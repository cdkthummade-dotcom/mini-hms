// Pure logic tests — no DB connection required
function formatUID(orgCode, year, serial) {
  return `${orgCode.toUpperCase()}${year}${String(serial).padStart(6, '0')}`;
}

describe('UID Generator (format logic)', () => {
  test('First patient DH 2026 → DH2026000001', () => {
    expect(formatUID('DH', 2026, 1)).toBe('DH2026000001');
  });

  test('Second patient → DH2026000002', () => {
    expect(formatUID('DH', 2026, 2)).toBe('DH2026000002');
  });

  test('999999th patient → DH2026999999', () => {
    expect(formatUID('DH', 2026, 999999)).toBe('DH2026999999');
  });

  test('New year 2027 → DH2027000001', () => {
    expect(formatUID('DH', 2027, 1)).toBe('DH2027000001');
  });

  test('UID is 12 characters', () => {
    const uid = formatUID('DH', 2026, 1);
    expect(uid.length).toBe(12);
  });

  test('UID matches regex pattern', () => {
    const uid = formatUID('DH', 2026, 1);
    expect(uid).toMatch(/^[A-Z]{2}\d{4}\d{6}$/);
  });

  test('Different org codes are independent', () => {
    const uid1 = formatUID('DH', 2026, 1);
    const uid2 = formatUID('AB', 2026, 1);
    expect(uid1).not.toBe(uid2);
    expect(uid1.startsWith('DH')).toBe(true);
    expect(uid2.startsWith('AB')).toBe(true);
  });

  test('Lowercase org code is uppercased', () => {
    const uid = formatUID('dh', 2026, 1);
    expect(uid.startsWith('DH')).toBe(true);
  });
});
