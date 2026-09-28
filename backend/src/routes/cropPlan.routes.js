const r = require('express').Router();
const c = require('../controllers/cropPlan.controller');
r.post('/', c.save);
r.get('/', c.mine);
module.exports = r;
