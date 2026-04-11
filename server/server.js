require('dotenv').config();

// In production, Supabase's direct host is IPv6-only and Render free tier
// has no IPv6 outbound. Route all pg queries through the Supabase Management
// API (HTTPS/IPv4) by patching pg.Pool before Sequelize loads it.
if (process.env.NODE_ENV === 'production' && process.env.SUPABASE_PROJECT_REF) {
  require('./config/pg-http-patch');
}

const app = require('./app');
const sequelize = require('./config/database');
const { loadAllMasters } = require('./services/cache.service');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    // Pre-load master data into Redis cache for org 1 (Demo Hospital)
    // In production, this would be per org on login; here we warm it up for the demo
    try {
      await loadAllMasters(1);
      console.log('Masters loaded into Redis cache');
    } catch (cacheErr) {
      console.warn('Redis cache warm-up failed (non-fatal):', cacheErr.message);
    }

    app.listen(PORT, () => {
      console.log(`HMS Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
    process.exit(1);
  }
}

startServer();
