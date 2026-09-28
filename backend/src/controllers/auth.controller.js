const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const v = require('../utils/validate');

const token = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const safe = (u) => { const o = u.toObject(); delete o.passwordHash; return o; };

exports.register = asyncHandler(async (req, res) => {
  const b = req.body;
  const password = v.str(b.password, 'Password', 6, 100);
  const user = await User.create({
    name: v.str(b.name, 'Name', 2, 80), phone: v.phone(b.phone), email: v.email(b.email),
    passwordHash: await bcrypt.hash(password, 10),
    village: v.str(b.village, 'Village'), taluka: v.str(b.taluka, 'Taluka'),
    district: v.str(b.district, 'District'), state: v.str(b.state, 'State'),
    landArea: v.toAcres(b.landArea, b.landUnit),
  });
  res.status(201).json({ token: token(user.id), user: safe(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const email = v.email(req.body.email);
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.passwordHash)))
    throw new ApiError(401, 'Invalid email or password');
  res.json({ token: token(user.id), user: safe(user) });
});

exports.me = (req, res) => res.json({ user: req.user });
