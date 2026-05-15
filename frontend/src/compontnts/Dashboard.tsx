import { useState } from 'react';
import { Products } from './Products.tsx';

interface User {
    id: string;
    email: string;
    brand: string;
}

interface DashboardProps {
    user: User | null;
    onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
    const [activeMenu, setActiveMenu] = useState<'home' | 'products'>('home');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        onLogout();
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-400 flex flex-col
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-5 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-white">Productr</span>
                        <span className="text-lg">🧡</span>
                    </div>
                </div>

                <div className="px-4 pb-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="11" cy="11" r="8" strokeWidth="2" />
                            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full bg-slate-800 text-slate-300 text-sm rounded-lg pl-9 pr-3 py-2 border border-slate-700 focus:outline-none focus:border-slate-600 placeholder-slate-500"
                        />
                    </div>
                </div>

                <nav className="flex-1 px-3 py-2 space-y-1">
                    <button
                        onClick={() => { setActiveMenu('home'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeMenu === 'home'
                            ? 'bg-white/10 text-white border-l-2 border-indigo-500'
                            : 'hover:bg-white/5 hover:text-slate-200'
                            }`}
                    >
                        <span className="text-lg">🏠</span>
                        Home
                    </button>
                    <button
                        onClick={() => { setActiveMenu('products'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeMenu === 'products'
                            ? 'bg-white/10 text-white border-l-2 border-indigo-500'
                            : 'hover:bg-white/5 hover:text-slate-200'
                            }`}
                    >
                        <span className="text-lg">📦</span>
                        Products
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-700 rounded-lg text-sm font-medium text-slate-400 hover:border-red-500 hover:text-red-400 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 h-16">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center gap-2 text-slate-800 font-semibold">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeWidth="2" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                            </svg>
                            {activeMenu === 'home' ? 'Home' : 'Products'}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:block relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" strokeWidth="2" />
                                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search Services, Products"
                                className="w-64 bg-slate-50 text-sm rounded-lg pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 placeholder-slate-400"
                            />
                        </div>
                        <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
                            <div className="hidden sm:block text-right">
                                <div className="text-sm font-semibold text-slate-800 leading-tight">{user?.brand}</div>
                                <div className="text-xs text-slate-600 leading-tight">{user?.email}</div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-700 to-blue-700 text-white flex items-center justify-center text-sm font-bold shadow-md">
                                {user?.email?.[0]?.toUpperCase()}
                            </div>
                            <svg className="w-4 h-4 text-slate-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeMenu === 'home' ? (
                        <div className="min-h-screen flex items-center justify-center px-4">
                            <div className="text-center flex flex-col items-center">

                                <div className="w-16 h-16 text-blue-900 mb-4">
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    >
                                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                        <path
                                            d="M17.5 17.5h-3v-3h3v3zm0-3v3m-3-3h3"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>

                                <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                                    Feels a little empty over here...
                                </h2>

                                <p className="text-sm text-slate-400 max-w-sm mb-6">
                                    You can create products without connecting store.
                                    You can add products to store anytime.
                                </p>



                            </div>
                        </div>
                    ) : (
                        <Products />
                    )}
                </div>
            </main>
        </div>
    );
}