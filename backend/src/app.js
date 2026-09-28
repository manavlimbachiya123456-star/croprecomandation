const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const auth = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',') }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/farmer', auth, require('./routes/farmer.routes'));
app.use('/api/soil', auth, require('./routes/soil.routes'));
app.use('/api/crop-plan', auth, require('./routes/cropPlan.routes'));
app.use('/api/recommendations', auth, require('./routes/recommendation.routes'));
app.use('/api/area', auth, require('./routes/area.routes'));

app.use(notFound);
app.use(errorHandler);
module.exports = app;
