import { useState, useEffect } from 'react';
import { Products } from './Products.tsx';
import './Dashboard.css';

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
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="brand-logo">
                        <span className="logo-text">Productr</span>
                        <span className="logo-icon">🧡</span>
                    </div>
                </div>

                <div className="search-box">
                    <input type="text" placeholder="Search" className="search-input" />
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeMenu === 'home' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveMenu('home');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <span className="nav-icon">🏠</span>
                        Home
                    </button>
                    <button
                        className={`nav-item ${activeMenu === 'products' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveMenu('products');
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <span className="nav-icon">📦</span>
                        Products
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {/* Header */}
                <header className="dashboard-header">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            ☰
                        </button>
                        <div className="header-title">Products</div>
                    </div>

                    {/* Add this search if you want it in the header */}
                    <div className="header-search">
                        <input
                            type="text"
                            placeholder="Search Services, Products"
                            className="header-search-input"
                        />
                    </div>

                    <div className="user-profile">
                        <div className="user-info">
                            <div className="user-brand">{user?.brand}</div>
                            <div className="user-email">{user?.email}</div>
                        </div>
                        <div className="user-avatar">{user?.email?.[0]?.toUpperCase()}</div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="content-area">
                    {activeMenu === 'home' ? (
                        <div className="home-section">
                            <h1>Welcome to Productr</h1>
                            <p>Manage and publish your products to the market.</p>
                            <div className="welcome-cards">
                                <div className="card">
                                    <div className="card-icon">📦</div>
                                    <h3>Add Products</h3>
                                    <p>Create and manage your product listings</p>
                                    <button
                                        className="card-btn"
                                        onClick={() => setActiveMenu('products')}
                                    >
                                        Go to Products
                                    </button>
                                </div>
                                <div className="card">
                                    <div className="card-icon">🚀</div>
                                    <h3>Publish Products</h3>
                                    <p>Make your products available to customers</p>
                                </div>
                                <div className="card">
                                    <div className="card-icon">📊</div>
                                    <h3>Track Sales</h3>
                                    <p>Monitor your product performance</p>
                                </div>
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
