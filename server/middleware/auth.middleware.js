const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';

function requireAuth(req, res, next) {
  // 1. Session cookie exists — use it (normal flow)
  if (req.session && req.session.user) {
    return next();
  }

  // 2. No session cookie — try JWT from Authorization header
  //    (fallback for devices/browsers that block third-party cookies)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      // Inject into req.session.user so all downstream code works unchanged
      if (!req.session) req.session = {};
      req.session.user = decoded;
      return next();
    } catch (err) {
      // Token expired or invalid — fall through to 401
    }
  }

  return res.status(401).json({ error: 'Unauthorized — please log in' });
}

module.exports = { requireAuth };
