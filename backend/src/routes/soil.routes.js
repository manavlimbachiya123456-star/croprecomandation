const r = require('express').Router();
const c = require('../controllers/soil.controller');
r.post('/', c.create);
r.get('/latest', c.latest);
module.exports = r;
