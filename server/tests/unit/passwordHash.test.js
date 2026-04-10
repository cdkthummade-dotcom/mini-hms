const bcrypt = require('bcrypt');

describe('Password Hashing', () => {
  let hash;

  beforeAll(async () => {
    hash = await bcrypt.hash('Demo@1234', 12);
  });

  test('Hash is not equal to plain text', () => {
    expect(hash).not.toBe('Demo@1234');
  });

  test('Compare correct password → true', async () => {
    const match = await bcrypt.compare('Demo@1234', hash);
    expect(match).toBe(true);
  });

  test('Compare wrong password → false', async () => {
    const match = await bcrypt.compare('Wrong@1234', hash);
    expect(match).toBe(false);
  });

  test('Hash length is > 50 characters (bcrypt output)', () => {
    expect(hash.length).toBeGreaterThan(50);
  });

  test('Two hashes of same password are different (salted)', async () => {
    const hash2 = await bcrypt.hash('Demo@1234', 12);
    expect(hash).not.toBe(hash2);
  });
});
