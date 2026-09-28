const CropPlan = require('../models/CropPlan');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const v = require('../utils/validate');
const C = require('../constants');

const title = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

// Upsert: one plan per farmer per season, so the same farm is never double-counted.
exports.save = asyncHandler(async (req, res) => {
  const b = req.body, u = req.user;
  const currentCrop = b.currentCrop ? title(v.str(b.currentCrop, 'Current crop', 1, 40)) : '';
  const plannedCrop = b.plannedCrop ? title(v.str(b.plannedCrop, 'Planned crop', 1, 40)) : '';
  if (!currentCrop && !plannedCrop) throw new ApiError(400, 'Enter a current crop or a planned crop');
  const landArea = v.toAcres(b.landArea, b.landUnit);
  if (landArea > u.landArea * 1.001) throw new ApiError(400, `Crop area cannot exceed your farm area (${u.landArea} acres)`);
  const season = v.oneOf(b.season, 'Season', C.SEASONS);
  const plan = await CropPlan.findOneAndUpdate(
    { farmerId: u.id, season },
    { farmerId: u.id, village: u.village, taluka: u.taluka, district: u.district, state: u.state,
      currentCrop, plannedCrop, crop: plannedCrop || currentCrop, landArea, season,
      expectedYield: b.expectedYield === '' || b.expectedYield == null ? undefined : v.num(b.expectedYield, 'Expected yield', 0, 1e6),
      createdAt: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true },
  );
  res.status(201).json({ plan });
});

exports.mine = asyncHandler(async (req, res) => {
  res.json({ plans: await CropPlan.find({ farmerId: req.user.id }).sort({ createdAt: -1 }) });
});
