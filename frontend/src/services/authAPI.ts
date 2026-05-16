import axios from 'axios';

const API_BASE_URL = 'https://ourfy.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authAPI = {
    signup: (email: string) =>
        api.post('api/auth/signup', { email }),

    sendOTP: (email: string) =>
        api.post('api/auth/send-otp', { email }),

    verifyOTP: (email: string, otp: string) =>
        api.post('api/auth/verify-otp', { email, otp })
};

export default api;
