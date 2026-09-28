const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const v = require('../utils/validate');

exports.get = (req, res) => res.json({ user: req.user });

exports.update = asyncHandler(async (req, res) => {
  const b = req.body;
  const u = req.user;
  u.name = v.str(b.name, 'Name', 2, 80);
  u.phone = v.phone(b.phone);
  u.village = v.str(b.village, 'Village'); u.taluka = v.str(b.taluka, 'Taluka');
  u.district = v.str(b.district, 'District'); u.state = v.str(b.state, 'State');
  u.landArea = v.toAcres(b.landArea, b.landUnit);
  await u.save();
  res.json({ user: await User.findById(u.id).select('-passwordHash') });
});
