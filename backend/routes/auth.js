import express from 'express';
import User from '../models/User.js';
import { sendOTPEmail } from '../services/emailService.js';
import { generateOTP, getOTPExpireTime } from '../utils/helpers.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
const router = express.Router();

// send otp
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

//rate limiting
const sendOTPRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 
    max: 5, // 
    message: { message: 'Too many OTP requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const verifyOTPRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Too many verification attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

//routes

//send otp
router.post('/send-otp', sendOTPRateLimit, async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (email && !isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const normalizedEmail = email ? email.toLowerCase().trim() : null;
        const user = await User.findOne({

            email: normalizedEmail,

        });

        if (!user) {
            return res.status(404).json({
                message: 'No email registered. Please sign up first.'
            });
        }

        const otp = generateOTP();
        console.log(`Generated OTP for ${normalizedEmail}: ${otp}`);
        const otpExpire = getOTPExpireTime();
        const hashedOTP = await bcryptjs.hash(otp, 10);
        user.otp = hashedOTP;
        user.otpExpire = otpExpire;
        await user.save();
        await sendOTPEmail(normalizedEmail, otp);
        res.status(200).json({
            message: 'OTP sent successfully',
            email: normalizedEmail,
            otp: otp // For testing purposes only. Remove in production.
        });
        console.log(`OTP for ${normalizedEmail}: ${otp}`);
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
});

// verify otp and Login
router.post('/verify-otp', verifyOTPRateLimit, async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Validate inputs
        if (email && !isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const normalizedEmail = email ? email.toLowerCase().trim() : null;


        // find user
        const user = await User.findOne({

            email: normalizedEmail,


        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.otpExpire || new Date() > user.otpExpire) {
            return res.status(400).json({ message: 'OTP has expired. Request a new OTP.' });
        }

        // Verify OTP using bcrypt comparison
        const isValidOTP = await bcryptjs.compare(otp, user.otp);
        if (!isValidOTP) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.otp = null;
        user.otpExpire = null;

        if (!user.isVerified) {
            user.isVerified = true;
        }

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
});


router.post('/signup', sendOTPRateLimit, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Validate inputs
        if (email && !isValidEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const normalizedEmail = email ? email.toLowerCase().trim() : null;
        // Check if user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // create and hash OTP
        const otp = generateOTP();
        const otpExpire = getOTPExpireTime();
        const hashedOTP = await bcryptjs.hash(otp, 10);


        const user = new User({
            email: normalizedEmail,
            otp: hashedOTP,
            otpExpire,
            isVerified: false
        });
        await sendOTPEmail(normalizedEmail, otp);
        await user.save();

        res.status(201).json({
            message: 'Signup successful. OTP sent.',
            email: normalizedEmail,

        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error during signup', error: error.message });
    }
});


export default router;