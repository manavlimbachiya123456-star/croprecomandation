const asyncHandler = require('../utils/asyncHandler');
const { getAreaStats } = require('../services/area.service');

exports.summary = asyncHandler(async (req, res) => {
  const stats = await getAreaStats(req.user);
  const { distributionMap, ...rest } = stats;
  res.json({ area: rest });
});
