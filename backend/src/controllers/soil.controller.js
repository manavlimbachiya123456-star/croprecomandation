const SoilRecord = require('../models/SoilRecord');
const asyncHandler = require('../utils/asyncHandler');
const v = require('../utils/validate');
const C = require('../constants');

exports.create = asyncHandler(async (req, res) => {
  const b = req.body;
  const rec = await SoilRecord.create({
    farmerId: req.user.id,
    N: v.num(b.N, 'Nitrogen (N)', 0, 300), P: v.num(b.P, 'Phosphorus (P)', 0, 300), K: v.num(b.K, 'Potassium (K)', 0, 300),
    ph: v.num(b.ph, 'Soil pH', 0, 14), temperature: v.num(b.temperature, 'Temperature', -5, 55),
    humidity: v.num(b.humidity, 'Humidity', 0, 100), rainfall: v.num(b.rainfall, 'Rainfall', 0, 5000),
    soilType: v.oneOf(b.soilType, 'Soil type', C.SOIL_TYPES),
    waterAvailability: v.oneOf(b.waterAvailability, 'Water availability', C.WATER),
    season: v.oneOf(b.season, 'Season', C.SEASONS),
  });
  res.status(201).json({ soil: rec });
});

exports.latest = asyncHandler(async (req, res) => {
  res.json({ soil: await SoilRecord.findOne({ farmerId: req.user.id }).sort({ createdAt: -1 }) });
});
