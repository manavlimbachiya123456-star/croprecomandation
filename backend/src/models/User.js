const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  village: { type: String, required: true, trim: true },
  taluka: { type: String, required: true, trim: true },
  district: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  landArea: { type: Number, required: true }, // always stored in ACRES
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('User', userSchema);
