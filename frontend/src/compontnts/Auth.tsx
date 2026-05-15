import { useState, useRef } from 'react';
import { authAPI } from '../services/authAPI';
import './Auth.css';

type AuthMode = 'login' | 'signup';

interface LoginForm {
    email: string;
}

interface SignupForm {
    email: string;
}

interface OTPState {
    email: string;
    showOTP: boolean;
    otp: string[];
}

interface AuthProps {
    onLoginSuccess: (user: any) => void;
}

export function Auth({ onLoginSuccess }: AuthProps) {
    const [mode, setMode] = useState<AuthMode>('login');
    const [loginForm, setLoginForm] = useState<LoginForm>({ email: '' });
    const [signupForm, setSignupForm] = useState<SignupForm>({ email: '' });
    const [otpState, setOtpState] = useState<OTPState>({ email: '', showOTP: false, otp: ['', '', '', '', '', ''] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Login mode handlers
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSendOTP = async () => {
        if (!loginForm.email) {
            setError('Please enter your email');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await authAPI.sendOTP(loginForm.email);
            setOtpState({
                email: loginForm.email,
                showOTP: true,
                otp: ['', '', '', '', '', '']
            });
            setSuccess('OTP sent to your email!');
            startResendTimer();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error sending OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        const otpCode = otpState.otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authAPI.verifyOTP(loginForm.email, otpCode);
            setSuccess('Login successful!');
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onLoginSuccess(response.data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error verifying OTP');
        } finally {
            setLoading(false);
        }
    };

    // Signup mode handlers
    const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignupForm(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSignup = async () => {
        if (!signupForm.email) {
            setError('Email is required');
            return;
        }


        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await authAPI.signup(signupForm.email);
            setOtpState({
                email: signupForm.email,
                showOTP: true,
                otp: ['', '', '', '', '', '']
            });
            setSuccess('Account created! OTP sent to your email.');
            startResendTimer();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error during signup');
        } finally {
            setLoading(false);
        }
    };

    const handleSignupVerifyOTP = async () => {
        const otpCode = otpState.otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authAPI.verifyOTP(signupForm.email, otpCode);
            setSuccess('Account verified! Logging you in...');
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onLoginSuccess(response.data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error verifying OTP');
        } finally {
            setLoading(false);
        }
    };

    // OTP input handler
    const handleOTPChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otpState.otp];
        newOtp[index] = value.slice(-1);
        setOtpState(prev => ({ ...prev, otp: newOtp }));

        // Move to next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };

    const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpState.otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                <div className="auth-left">
                    <div className="brand-section">
                        <h1>Productr</h1>
                        <p>Uplist your product to market</p>
                        <div className="brand-illustration">
                            <div className="running-figure"></div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    {!otpState.showOTP ? (
                        <>
                            <h2>Login to your Productr Account</h2>

                            <div className="mode-tabs">
                                <button
                                    className={`tab ${mode === 'login' ? 'active' : ''}`}
                                    onClick={() => {
                                        setMode('login');
                                        setError('');
                                        setSuccess('');
                                    }}
                                >
                                    Login
                                </button>
                                <button
                                    className={`tab ${mode === 'signup' ? 'active' : ''}`}
                                    onClick={() => {
                                        setMode('signup');
                                        setError('');
                                        setSuccess('');
                                    }}
                                >
                                    Sign Up
                                </button>
                            </div>

                            {error && <div className="alert alert-error">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            {mode === 'login' ? (
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={loginForm.email}
                                        onChange={handleLoginChange}
                                        className="input-field"
                                    />

                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSendOTP}
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending OTP...' : 'Continue'}
                                    </button>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={signupForm.email}
                                        onChange={handleSignupChange}
                                        className="input-field"
                                    />

                                    <button
                                        className="btn btn-primary"
                                        onClick={handleSignup}
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating Account...' : 'Sign Up'}
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <h2>Enter OTP</h2>
                            <p className="otp-subtitle">We've sent an OTP to {otpState.email}</p>

                            {error && <div className="alert alert-error">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <div className="otp-inputs">
                                {otpState.otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => { otpInputRefs.current[index] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleOTPChange(index, e.target.value)}
                                        onKeyDown={e => handleOTPKeyDown(index, e)}
                                        className="otp-input"
                                        placeholder="0"
                                    />
                                ))}
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={mode === 'login' ? handleVerifyOTP : handleSignupVerifyOTP}
                                disabled={loading}
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            <div className="resend-section">
                                {resendTimer > 0 ? (
                                    <p>Resend OTP in {resendTimer}s</p>
                                ) : (
                                    <button
                                        className="btn-link"
                                        onClick={mode === 'login' ? handleSendOTP : handleSignup}
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <button
                                className="btn-link back-btn"
                                onClick={() => {
                                    setOtpState({ email: '', showOTP: false, otp: ['', '', '', '', '', ''] });
                                    setError('');
                                    setSuccess('');
                                }}
                            >
                                ← Back
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
