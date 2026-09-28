const r = require('express').Router();
const c = require('../controllers/recommendation.controller');
r.post('/stage1', c.stage1);
r.post('/generate', c.generate);
r.get('/latest', c.latest);
r.get('/history', c.history);
module.exports = r;
