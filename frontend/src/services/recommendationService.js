import api from './api';

export const saveSoil = (d) => api.post('/soil', d).then((r) => r.data.soil);
export const getLatestSoil = () => api.get('/soil/latest').then((r) => r.data.soil);
export const saveCropPlan = (d) => api.post('/crop-plan', d).then((r) => r.data.plan);
export const getCropPlans = () => api.get('/crop-plan').then((r) => r.data.plans);
export const analyzeLand = () => api.post('/recommendations/stage1').then((r) => r.data.recommendation);
export const generateFinal = () => api.post('/recommendations/generate').then((r) => r.data.recommendation);
export const getLatest = (finalOnly = false) =>
  api.get('/recommendations/latest', { params: finalOnly ? { final: 1 } : {} }).then((r) => r.data.recommendation);
export const getHistory = () => api.get('/recommendations/history').then((r) => r.data.history);
export const getAreaSummary = () => api.get('/area/summary').then((r) => r.data.area);
