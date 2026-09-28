const r = require('express').Router();
const c = require('../controllers/farmer.controller');
r.get('/profile', c.get);
r.put('/profile', c.update);
module.exports = r;
