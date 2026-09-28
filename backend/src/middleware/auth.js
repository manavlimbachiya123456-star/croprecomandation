const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

module.exports = async (req, _res, next) => {
  try {
    const h = req.headers.authorization || '';
    if (!h.startsWith('Bearer ')) throw new ApiError(401, 'Not authenticated');
    const { id } = jwt.verify(h.slice(7), process.env.JWT_SECRET);
    const user = await User.findById(id).select('-passwordHash');
    if (!user) throw new ApiError(401, 'User no longer exists');
    req.user = user;
    next();
  } catch (e) {
    next(e.status ? e : new ApiError(401, 'Invalid or expired token'));
  }
};
