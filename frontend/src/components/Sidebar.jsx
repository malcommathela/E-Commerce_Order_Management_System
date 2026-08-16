import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/orders', label: 'Orders', icon: '📦' },
    { path: '/products', label: 'Products', icon: '🛍️' },
    { path: '/inventory', label: 'Inventory', icon: '📋' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/payments', label: 'Payments', icon: '💳' },
    { path: '/suppliers', label: 'Suppliers', icon: '🏭' },
    { path: '/categories', label: 'Categories', icon: '🏷️' },
    { path: '/items', label: 'Order Items', icon: '📝' },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="brand-icon">🛒</span>
                <span className="brand-text">OrderMgr</span>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {user && (
                <div className="sidebar-user">
                    <div className="user-name">{user.first_name} {user.last_name}</div>
                    <div className="user-role">{user.role}</div>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
            )}

            <div className="sidebar-footer">
                <span>v1.0.0</span>
            </div>
        </aside>
    );
};

export default Sidebar;