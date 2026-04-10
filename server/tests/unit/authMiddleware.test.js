const { requireAuth } = require('../../middleware/auth.middleware');

function mockReq(session = {}) { return { session }; }
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('Auth Middleware', () => {
  test('No session → 401', () => {
    const req = mockReq({});
    const res = mockRes();
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('Session with user → next() called', () => {
    const req = mockReq({ user: { id: 1, role: 'receptionist' } });
    const res = mockRes();
    const next = jest.fn();
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
