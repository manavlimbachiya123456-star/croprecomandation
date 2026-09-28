const ApiError = require('./ApiError');
const { UNITS } = require('../constants');
const bad = (m) => { throw new ApiError(400, m); };

exports.str = (v, label, min = 1, max = 100) => {
  const s = typeof v === 'string' ? v.trim() : '';
  if (s.length < min || s.length > max) bad(`${label} is required (${min}-${max} characters)`);
  return s;
};
exports.num = (v, label, min, max) => {
  const n = Number(v);
  if (v === '' || v === null || v === undefined || Number.isNaN(n) || n < min || n > max)
    bad(`${label} must be a number between ${min} and ${max}`);
  return n;
};
exports.oneOf = (v, label, list) => {
  const s = String(v || '').toLowerCase();
  if (!list.includes(s)) bad(`${label} must be one of: ${list.join(', ')}`);
  return s;
};
exports.toAcres = (value, unit = 'acre') => {
  const u = String(unit || 'acre').toLowerCase();
  if (!UNITS[u]) bad(`Land unit must be one of: ${Object.keys(UNITS).join(', ')}`);
  const n = exports.num(value, 'Land area', 0.001, 1e7);
  return Math.round(n * UNITS[u] * 1000) / 1000;
};
exports.email = (v) => {
  const s = exports.str(v, 'Email', 5, 120).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(s)) bad('Email is invalid');
  return s;
};
exports.phone = (v) => {
  const s = exports.str(v, 'Mobile', 10, 15);
  if (!/^\+?\d{10,14}$/.test(s)) bad('Mobile must be 10-14 digits');
  return s;
};
