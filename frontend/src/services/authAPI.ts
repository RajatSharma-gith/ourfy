import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authAPI = {
    signup: (email: string) =>
        api.post('/auth/signup', { email }),

    sendOTP: (email: string) =>
        api.post('/auth/send-otp', { email }),

    verifyOTP: (email: string, otp: string) =>
        api.post('/auth/verify-otp', { email, otp })
};

export default api;
