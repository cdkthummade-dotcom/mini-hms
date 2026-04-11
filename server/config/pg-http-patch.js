'use strict';

/**
 * pg-http-patch.js
 *
 * Replaces pg.Pool and pg.Client with HTTP-based equivalents that route all
 * SQL through the Supabase Management API (HTTPS/IPv4).
 *
 * Render free tier has no IPv6 outbound; Supabase direct host is IPv6-only.
 * Must be required BEFORE sequelize or pg to take effect.
 */

const { EventEmitter } = require('events');
const axios = require('axios');

const MGMT_URL = `https://api.supabase.com/v1/projects/${process.env.SUPABASE_PROJECT_REF}/database/query`;
const AUTH_HDR  = `Bearer ${process.env.SUPABASE_MANAGEMENT_TOKEN}`;

/* ── value escaping ─────────────────────────────────────────────────── */
function escapeVal(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean')          return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number')           return String(val);
  if (val instanceof Date)               return `'${val.toISOString()}'`;
  if (Array.isArray(val))                return `ARRAY[${val.map(escapeVal).join(',')}]`;
  if (typeof val === 'object')           return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${String(val).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`;
}

function inlineParams(text, values) {
  if (!values || values.length === 0) return text;
  let sql = text;
  // Replace from largest index first so $10 isn't partially hit by $1
  for (let i = values.length; i >= 1; i--) {
    sql = sql.split('$' + i).join(escapeVal(values[i - 1]));
  }
  return sql;
}

/* ── statements that are no-ops over HTTP (transaction management) ───── */
const NOOP_RE = /^\s*(BEGIN|COMMIT|ROLLBACK|SET\s|SAVEPOINT|RELEASE\s+SAVEPOINT|ROLLBACK\s+TO|DEALLOCATE|DISCARD)/i;

/* ── core HTTP executor ─────────────────────────────────────────────── */
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
    pgErr.code  = err.response?.data?.code || 'XX000';
    throw pgErr;
  }
}

/* ── fake pg.Client (Sequelize uses new pg.Client() directly) ───────── */
class HttpClient extends EventEmitter {
  constructor(config) {
    super();
    this.database   = config?.database || 'postgres';
    this.processID  = 1;
    this._connected = false;
    // Sequelize accesses client.connection.on('parameterStatus', ...) and
    // client.connection.removeListener(...) — provide a dummy EventEmitter
    this.connection = new EventEmitter();
  }

  /* Sequelize calls client.connect(callback) after new pg.Client() */
  connect(callback) {
    this._connected = true;
    if (typeof callback === 'function') {
      callback(null);
      return;
    }
    return Promise.resolve();
  }

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

  /* Sequelize may call end() when cleaning up */
  end(callback) {
    this._connected = false;
    if (typeof callback === 'function') callback(null);
    else return Promise.resolve();
  }

  release() {}
}

/* ── fake pg.Pool (some Sequelize paths use pool.connect()) ─────────── */
class HttpPool extends EventEmitter {
  constructor() { super(); }

  async connect()          { return new HttpClient(); }
  query(text, vals, cb)   { return new HttpClient().query(text, vals, cb); }
  async end()              {}
}

/* ── patch pg in the module cache ───────────────────────────────────── */
const pg     = require('pg');
pg.Pool      = HttpPool;
pg.Client    = HttpClient;
// Keep pg.types so Sequelize's type parsers still register

console.log('[pg-http-patch] All DB queries routed via Supabase HTTPS API (IPv4)');
