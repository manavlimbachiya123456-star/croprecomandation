const axios = require('axios');
const ApiError = require('../utils/ApiError');

const ml = axios.create({ baseURL: process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000', timeout: 15000 });

async function call(path, body) {
  try {
    return (await ml.post(path, body)).data;
  } catch (e) {
    if (e.response) throw new ApiError(502, `ML service error: ${JSON.stringify(e.response.data.detail || e.response.data)}`);
    throw new ApiError(503, 'ML service is not reachable. Start it on port 8000.');
  }
}

// STAGE 1: soil record -> top 6 crops
exports.cropSuitability = async (s) => (await call('/ml/crop-suitability', {
  N: s.N, P: s.P, K: s.K, ph: s.ph, temperature: s.temperature, humidity: s.humidity,
  rainfall: s.rainfall, soil_type: s.soilType, water_availability: s.waterAvailability, season: s.season,
})).recommendations;

// STAGE 2: stage1 + area distribution -> top 3
exports.areaRecommendation = async (payload) => (await call('/ml/area-recommendation', payload)).final_recommendations;
