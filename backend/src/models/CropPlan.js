const mongoose = require('mongoose');

const s = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  village: String, taluka: String, district: String, state: String,
  currentCrop: String,
  plannedCrop: String,
  crop: { type: String, required: true }, // crop counted in area statistics (planned, else current)
  landArea: { type: Number, required: true }, // acres
  season: String,
  expectedYield: Number,
  createdAt: { type: Date, default: Date.now },
}, { collection: 'crop_plans' });
s.index({ village: 1 }); s.index({ taluka: 1 }); s.index({ district: 1 });
s.index({ farmerId: 1, season: 1 }, { unique: true }); // one plan per farmer per season
module.exports = mongoose.model('CropPlan', s);
