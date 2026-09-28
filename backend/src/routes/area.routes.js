const r = require('express').Router();
r.get('/summary', require('../controllers/area.controller').summary);
module.exports = r;
