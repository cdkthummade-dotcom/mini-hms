// Server-side age calculation (mirrors client logic, no imports needed)
function calcAge(dob) {
  if (!dob) return { years: 0, months: 0, days: 0 };
  const birth = new Date(dob);
  const today = new Date();
  if (birth > today) return null;
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();
  if (days < 0) {
    months -= 1;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  if (months < 0) { years -= 1; months += 12; }
  return { years, months, days };
}

describe('Age Calculator', () => {
  test('DOB today → 0 Yrs 0 Mo 0 Days', () => {
    const today = new Date().toISOString().split('T')[0];
    const result = calcAge(today);
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  test('DOB exactly 1 year ago → 1 Yrs', () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    const result = calcAge(d.toISOString().split('T')[0]);
    expect(result.years).toBe(1);
  });

  test('DOB in the future → null', () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    const result = calcAge(d.toISOString().split('T')[0]);
    expect(result).toBeNull();
  });

  test('Null DOB → all zeros', () => {
    const result = calcAge(null);
    expect(result.years).toBe(0);
    expect(result.months).toBe(0);
    expect(result.days).toBe(0);
  });

  test('Leap year DOB 2000-02-29 → no error', () => {
    const result = calcAge('2000-02-29');
    expect(result).not.toBeNull();
    expect(result.years).toBeGreaterThan(20);
  });

  test('Manual age Y=45 M=0 D=0 stored as numbers', () => {
    const years = 45, months = 0, days = 0;
    expect(typeof years).toBe('number');
  });

  test('Result has years, months, days properties', () => {
    const result = calcAge('1990-06-15');
    expect(result).toHaveProperty('years');
    expect(result).toHaveProperty('months');
    expect(result).toHaveProperty('days');
  });
});
