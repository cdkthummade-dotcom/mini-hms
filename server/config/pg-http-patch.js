'use strict';

/**
 * pg-http-patch.js
 *
 * Replaces pg.Pool and pg.Client with HTTP-based equivalents that route all
 * SQL through the Supabase Management API (HTTPS/IPv4).
 *
 * Why: Render free tier has no IPv6 outbound. Supabase free tier direct DB
 * host is IPv6-only (no A record). The Management API endpoint is reachable
 * over IPv4/HTTPS from anywhere.
 *
 * Must be required BEFORE sequelize or pg to take effect.
 */

const axios = require('axios');

const MGMT_URL = `https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_REF}/database/query`;
const AUTH_HDR = `Bearer ${process.env.SUPABASE_MANAGEMENT_TOKEN}`;

/* ── value escaping ───────────────────────────────────────────────────── */
function escapeVal(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean')          return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number')           return String(val);
  if (val instanceof Date)               return `'${val.toISOString()}'`;
  if (Array.isArray(val))                return `ARRAY[${val.map(escapeVal).join(',')}]`;
  if (typeof val === 'object')           return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  // string — replace backslash then single-quote
  return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

function inlineParams(text, values) {
  if (!values || values.length === 0) return text;
  let sql = text;
  // Replace $N from largest to smallest so $10 isn't partially matched by $1
  for (let i = values.length; i >= 1; i--) {
    sql = sql.split('$' + i).join(escapeVal(values[i - 1]));
  }
  return sql;
}

/* ── no-op statements that can't go through the management API ────────── */
const NOOP_RE = /^\s*(BEGIN|COMMIT|ROLLBACK|SET\s|SAVEPOINT|RELEASE\s|ROLLBACK\s+TO|DEALLOCATE|DISCARD)/i;

/* ── core HTTP executor ───────────────────────────────────────────────── */
async function runSQL(text, values) {
  const sql = inlineParams(text, values);

  if (NOOP_RE.test(sql)) {
    return { rows: [], rowCount: 0, command: sql.trim().split(/\s/)[0].toUpperCase() };
  }

  try {
    const { data } = await axios.post(
      MGMT_URL,
      { query: sql },
      { headers: { Authorization: AUTH_HDR, 'Content-Type': 'application/json' }, timeout: 30000 }
    );
    const rows = Array.isArray(data) ? data : [];
    return { rows, rowCount: rows.length, command: sql.trim().split(/\s/)[0].toUpperCase() };
  } catch (err) {
    const msg = err.response?.data?.message || err.response?.data?.error || err.message;
    const pgErr = new Error(msg);
    pgErr.code = err.response?.data?.code || 'XX000';
    throw pgErr;
  }
}

/* ── fake pg.Client ───────────────────────────────────────────────────── */
class HttpClient {
  constructor() {}

  query(textOrConfig, values, callback) {
    let text, params;

    if (textOrConfig && typeof textOrConfig === 'object' && !Array.isArray(textOrConfig)) {
      text   = textOrConfig.text || textOrConfig.sql || '';
      params = textOrConfig.values || [];
    } else {
      text   = textOrConfig || '';
      params = Array.isArray(values) ? values : [];
    }

    if (typeof values === 'function') {
      callback = values;
      params   = [];
    }

    const promise = runSQL(text, params);

    if (typeof callback === 'function') {
      promise.then(r => callback(null, r)).catch(e => callback(e));
      return;
    }
    return promise;
  }

  release()    {}
  async end()  {}

  // Sequelize checks these
  get processID() { return 1; }
}

/* ── fake pg.Pool ─────────────────────────────────────────────────────── */
class HttpPool {
  constructor() {}

  async connect()                        { return new HttpClient(); }
  query(text, values, cb)               { return new HttpClient().query(text, values, cb); }
  async end()                            {}

  // EventEmitter stubs
  on()             { return this; }
  off()            { return this; }
  once()           { return this; }
  emit()           { return false; }
  removeListener() { return this; }
  removeAllListeners() { return this; }
}

/* ── patch pg in the module cache ─────────────────────────────────────── */
const pg = require('pg');
pg.Pool   = HttpPool;
pg.Client = HttpClient;

console.log('[pg-http-patch] All DB queries routed via Supabase HTTPS API (IPv4)');
