require('dotenv').config();
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { getRedisClient } = require('./config/redis');

const authRoutes = require('./routes/auth.routes');
const patientRoutes = require('./routes/patient.routes');
const autofillRoutes = require('./routes/autofill.routes');
const masterRoutes = require('./routes/master.routes');
const userRoutes = require('./routes/user.routes');
const uploadRoutes = require('./routes/upload.routes');
const auditRoutes = require('./routes/audit.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Security
app.use(helmet({
  contentSecurityPolicy: false, // Relaxed for demo
  crossOriginEmbedderPolicy: false,
}));

// CORS — allow Vite dev server and production frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://cdkthummade-dotcom.github.io',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Gzip compression — mandatory for low bandwidth
app.use(compression());

// Body parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Trust proxy (needed for req.ip behind Render/Vercel reverse proxy)
app.set('trust proxy', 1);

// Session store — Upstash Redis
const redisClient = getRedisClient();
app.use(session({
  store: new RedisStore({ client: redisClient, prefix: 'sess:' }),
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  name: 'hms.sid',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    // No maxAge — cookie is a pure "session cookie" that dies when
    // the browser (all tabs) is fully closed. Forces re-login.
  },
}));

// Health check (for UptimeRobot + cold start detection)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api', autofillRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
