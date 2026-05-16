
import API from '../api/axios.ts';

export const authAPI = {
    signup: (email: string) =>
        API.post('/auth/signup', { email }),

    sendOTP: (email: string) =>
        API.post('/auth/send-otp', { email }),

    verifyOTP: (email: string, otp: string) =>
        API.post('/auth/verify-otp', { email, otp })
};

export default authAPI;
