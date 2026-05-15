import { useState, useRef } from 'react';
import { authAPI } from '../services/authAPI';

type AuthMode = 'login' | 'signup';

interface AuthProps {
    onLoginSuccess: (user: any) => void;
}

export function Auth({ onLoginSuccess }: AuthProps) {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const startResendTimer = () => {
        setResendTimer(60);
        const interval = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
    };

    const handleSendOTP = async () => {
        if (!email) { setError('Please enter your email'); return; }
        setLoading(true); setError(''); setSuccess('');
        try {
            await authAPI.sendOTP(email);
            setShowOTP(true); setOtp(['', '', '', '', '', '']);
            setSuccess('OTP sent!'); startResendTimer();
        } catch (err: any) { setError(err.response?.data?.message || 'Error sending OTP'); }
        finally { setLoading(false); }
    };

    const handleSignup = async () => {
        if (!email) { setError('Email is required'); return; }
        setLoading(true); setError(''); setSuccess('');
        try {
            await authAPI.signup(email);
            setShowOTP(true); setOtp(['', '', '', '', '', '']);
            setSuccess('Account created! OTP sent.'); startResendTimer();
        } catch (err: any) { setError(err.response?.data?.message || 'Error during signup'); }
        finally { setLoading(false); }
    };

    const handleVerify = async () => {
        const code = otp.join('');
        if (code.length !== 6) { setError('Enter all 6 digits'); return; }
        setLoading(true); setError('');
        try {
            const response = await authAPI.verifyOTP(email, code);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            onLoginSuccess(response.data.user);
        } catch (err: any) { setError(err.response?.data?.message || 'Invalid OTP'); }
        finally { setLoading(false); }
    };

    const handleOTPChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50">

            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50">
                <div className="absolute top-6 left-8 flex items-center gap-2 z-10">
                    <span className="text-xl font-bold text-slate-800">Productr</span>
                    <span className="text-xl">🧡</span>
                </div>


                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-200/40 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-200/40 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-72 h-96 bg-linear-to-b from-orange-400 to-orange-600 rounded-4xl shadow-2xl flex flex-col items-center justify-end p-6 relative overflow-hidden">
                                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent"></div>
                                <div className="relative z-10 text-white text-center">
                                    <p className="text-sm font-medium opacity-90">Uplist your</p>
                                    <p className="text-sm font-medium opacity-90">product to market</p>
                                </div>
                                {/* Running figure silhouette */}
                                <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-48">
                                    <svg viewBox="0 0 100 140" fill="none" className="w-full h-full drop-shadow-lg">
                                        <path d="M50 20c8 0 15-7 15-15S58 0 50 0 35 7 35 15s7 15 15 15z" fill="#1e1b4b" />
                                        <path d="M65 35l-10 25-15-5-10 30 5 15 20-10 15 25 10-5-15-30 20-15-5-15-15 10z" fill="#1e1b4b" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {!showOTP ? (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800 mb-6">
                                    Login to your Productr Account
                                </h2>

                                <div className="flex gap-0 mb-6 bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'login'
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'signup'
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => { setEmail(e.target.value); setError(''); }}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                />
                                <button
                                    onClick={mode === 'login' ? handleSendOTP : handleSignup}
                                    disabled={loading}
                                    className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {loading ? 'Processing...' : mode === 'login' ? 'Continue' : 'Sign Up'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800 mb-1">Enter OTP</h2>
                                <p className="text-sm text-slate-500">We've sent an OTP to {email}</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-3">Enter OTP</label>
                                <div className="flex gap-2 justify-center">
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={el => { otpRefs.current[i] = el; }}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleOTPChange(i, e.target.value)}
                                            onKeyDown={e => handleKeyDown(i, e)}
                                            className="w-12 h-12 text-center text-lg font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        />
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleVerify}
                                disabled={loading}
                                className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {loading ? 'Verifying...' : 'Enter your OTP'}
                            </button>

                            <div className="text-center">
                                {resendTimer > 0 ? (
                                    <p className="text-xs text-slate-400">Resend in {resendTimer}s</p>
                                ) : (
                                    <button
                                        onClick={mode === 'login' ? handleSendOTP : handleSignup}
                                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => { setShowOTP(false); setError(''); setSuccess(''); }}
                                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                            >
                                ← Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}