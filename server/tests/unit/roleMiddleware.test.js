const { requireRole } = require('../../middleware/role.middleware');

function mockReq(role) { return { session: { user: { id: 1, role } } }; }
function mockRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('Role Middleware', () => {
  test('Receptionist on admin-only route → 403', () => {
    const req = mockReq('receptionist');
    const res = mockRes();
    const next = jest.fn();
    requireRole('admin', 'superadmin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('Admin on admin-only route → next()', () => {
    const req = mockReq('admin');
    const res = mockRes();
    const next = jest.fn();
    requireRole('admin', 'superadmin')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Admin on superadmin-only route → 403', () => {
    const req = mockReq('admin');
    const res = mockRes();
    const next = jest.fn();
    requireRole('superadmin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('SuperAdmin on superadmin-only route → next()', () => {
    const req = mockReq('superadmin');
    const res = mockRes();
    const next = jest.fn();
    requireRole('superadmin')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Receptionist on receptionist-allowed route → next()', () => {
    const req = mockReq('receptionist');
    const res = mockRes();
    const next = jest.fn();
    requireRole('receptionist', 'admin', 'superadmin')(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('No session → 401', () => {
    const req = { session: {} };
    const res = mockRes();
    const next = jest.fn();
    requireRole('admin')(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
