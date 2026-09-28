module.exports = {
  SOIL_TYPES: ['sandy', 'loamy', 'clay', 'black', 'red', 'alluvial', 'other'],
  WATER: ['low', 'medium', 'high'],
  SEASONS: ['kharif', 'rabi', 'zaid'],
  // acres per unit (bigha varies by state; 0.4 ~ Gujarat's common local bigha - adjust if needed)
  UNITS: { acre: 1, hectare: 2.47105, bigha: 0.4, guntha: 0.025, sqm: 0.000247105 },
};
