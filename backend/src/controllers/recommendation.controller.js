const Recommendation = require('../models/Recommendation');
const SoilRecord = require('../models/SoilRecord');
const CropPlan = require('../models/CropPlan');
const ml = require('../services/ml.service');
const { getAreaStats } = require('../services/area.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

async function latestSoil(farmerId) {
  const soil = await SoilRecord.findOne({ farmerId }).sort({ createdAt: -1 });
  if (!soil) throw new ApiError(400, 'Please add your soil data first (Soil Data page).');
  return soil;
}

// STAGE 1 only: "What can this farmer grow?"
exports.stage1 = asyncHandler(async (req, res) => {
  const soil = await latestSoil(req.user.id);
  const stage1 = await ml.cropSuitability(soil);
  const rec = await Recommendation.create({ farmerId: req.user.id, stage1 });
  res.status(201).json({ recommendation: rec });
});

// Full flow: Stage 1 -> area stats -> Stage 2
exports.generate = asyncHandler(async (req, res) => {
  const user = req.user;
  const soil = await latestSoil(user.id);
  const plan = await CropPlan.findOne({ farmerId: user.id }).sort({ createdAt: -1 });
  if (!plan) throw new ApiError(400, 'Please add your crop plan first (Crop Plan page).');

  const stage1 = await ml.cropSuitability(soil);
  const area = await getAreaStats(user);
  const finalRecommendations = await ml.areaRecommendation({
    location: { village: user.village, taluka: user.taluka, district: user.district },
    stage1,
    area_distribution: area.distributionMap,
  });
  const { distributionMap, ...areaAnalysis } = area;
  const rec = await Recommendation.create({ farmerId: user.id, stage1, areaAnalysis, finalRecommendations });
  res.status(201).json({ recommendation: rec });
});

exports.latest = asyncHandler(async (req, res) => {
  const q = { farmerId: req.user.id };
  if (req.query.final === '1') q['finalRecommendations.0'] = { $exists: true };
  res.json({ recommendation: await Recommendation.findOne(q).sort({ createdAt: -1 }) });
});

exports.history = asyncHandler(async (req, res) => {
  res.json({ history: await Recommendation.find({ farmerId: req.user.id }).sort({ createdAt: -1 }).limit(20) });
});
