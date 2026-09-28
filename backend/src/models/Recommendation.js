const mongoose = require('mongoose');

module.exports = mongoose.model('Recommendation', new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stage1: [{ _id: false, crop: String, score: Number }],
  areaAnalysis: { type: mongoose.Schema.Types.Mixed, default: null },
  finalRecommendations: { type: [mongoose.Schema.Types.Mixed], default: [] },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'recommendations' }));
