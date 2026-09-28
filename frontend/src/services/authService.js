import api from './api';

export const registerUser = (d) => api.post('/auth/register', d).then((r) => r.data);
export const loginUser = (d) => api.post('/auth/login', d).then((r) => r.data);
export const getMe = () => api.get('/auth/me').then((r) => r.data.user);
export const updateProfile = (d) => api.put('/farmer/profile', d).then((r) => r.data.user);
