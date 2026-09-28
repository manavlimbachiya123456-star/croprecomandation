const mongoose = require('mongoose');

module.exports = mongoose.model('SoilRecord', new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  N: Number, P: Number, K: Number, ph: Number,
  temperature: Number, humidity: Number, rainfall: Number,
  soilType: String, waterAvailability: String, season: String,
  createdAt: { type: Date, default: Date.now },
}, { collection: 'soil_records' }));
