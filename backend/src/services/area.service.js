const CropPlan = require('../models/CropPlan');

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const ci = (v) => new RegExp(`^${esc(v)}$`, 'i');

const confidence = (n) => (n < 20 ? 'Low' : n <= 100 ? 'Medium' : 'High'); // <20 low, 20-100 medium, >100 high

// MongoDB aggregation: land + farmers per crop, and overall totals, for one match filter.
async function aggregate(match) {
  const [r] = await CropPlan.aggregate([
    { $match: match },
    { $facet: {
      crops: [
        { $group: { _id: '$crop', landArea: { $sum: '$landArea' }, farmers: { $addToSet: '$farmerId' } } },
        { $project: { _id: 0, crop: '$_id', landArea: 1, farmerCount: { $size: '$farmers' } } },
        { $sort: { landArea: -1 } },
      ],
      totals: [
        { $group: { _id: null, totalLand: { $sum: '$landArea' }, farmers: { $addToSet: '$farmerId' } } },
        { $project: { _id: 0, totalLand: 1, farmerCount: { $size: '$farmers' } } },
      ],
    } },
  ]);
  const t = r.totals[0] || { totalLand: 0, farmerCount: 0 };
  const round = (n) => Math.round(n * 100) / 100;
  const distribution = r.crops.map((c) => ({
    crop: c.crop, landArea: round(c.landArea), farmerCount: c.farmerCount,
    percentage: t.totalLand ? round((c.landArea / t.totalLand) * 100) : 0, // cropLand / totalLand * 100
  }));
  return { farmers: t.farmerCount, totalLand: round(t.totalLand), distribution };
}

/** Village -> taluka -> district fallback. */
exports.getAreaStats = async (user) => {
  const min = Number(process.env.MIN_FARMERS_FOR_LEVEL) || 3;
  const levels = [
    { level: 'village', name: user.village, match: { village: ci(user.village) } },
    { level: 'taluka', name: user.taluka, match: { taluka: ci(user.taluka), district: ci(user.district) } },
    { level: 'district', name: user.district, match: { district: ci(user.district) } },
  ];
  let best = null;
  for (const l of levels) {
    const stats = await aggregate(l.match);
    const cand = { level: l.level, name: l.name, ...stats };
    if (stats.farmers >= min) { best = cand; break; }
    if (!best || stats.farmers > best.farmers) best = cand;
  }
  return {
    ...best,
    confidence: confidence(best.farmers),
    note: 'Based on data reported by farmers using this platform.',
    distributionMap: Object.fromEntries(best.distribution.map((d) => [d.crop, d.percentage])),
  };
};
