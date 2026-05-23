import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
export const sendOTPEmail = async (email, otp) => {
    try {

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY not set in environment');
        }
        console.log('Sending email via Resend to:', email);

        const response = await axios.post(
            'https://api.resend.com/emails',
            {
                from: process.env.FROM_EMAIL || 'onboarding@resend.dev',
                to: email,
                subject: 'Your Ourfy OTP Code',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                        <h2 style="color: #333;">Email Verification</h2>
                        <p>Your One-Time Password (OTP) for Ourfy account verification is:</p>
                        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                            <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
                        </div>
                        <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                        <p>If you didn't request this OTP, please ignore this email.</p>
                    </div>
                `
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                family: 4,
                timeout: 15000
            }
        );

        console.log('Email sent:', response.data?.id);
        return true;
    } catch (error) {
        console.error('Email error:', error.response?.data || error.message);
        throw new Error('Failed to send email: ' + (error.response?.data?.message || error.message));
    }
};