import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
    try {
        const { data, error } = await resend.emails.send({
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
        });

        if (error) {
            console.error('Resend email error:', error);
            throw new Error(error.message);
        }

        console.log('Email sent successfully:', data?.id);
        return true;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
};