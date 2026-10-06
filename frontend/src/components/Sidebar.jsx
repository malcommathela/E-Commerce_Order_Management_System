import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/orders', label: 'Orders' },
    { path: '/products', label: 'Products' },
    { path: '/inventory', label: 'Inventory' },
    { path: '/customers', label: 'Customers' },
    { path: '/payments', label: 'Payments' },
    { path: '/suppliers', label: 'Suppliers' },
    { path: '/categories', label: 'Categories' },
    { path: '/items', label: 'Order Items' },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            <div className="menu-toggle">
                <span className="menu-toggle-brand">ORDERMGR</span>
                <button
                    className="menu-toggle-btn"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    aria-expanded={open}
                >
                    {open ? '×' : '+'}
                </button>
            </div>
            <aside className={`sidebar${open ? ' open' : ''}`}>
                <div className="sidebar-brand">
                    <span className="brand-mark">ORDERMGR</span>
                    <span className="brand-sup">/ OMS</span>
                </div>
                <nav className="sidebar-nav" aria-label="Primary">
                    {navItems.map((item, i) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-index">{String(i + 1).padStart(2, '0')}</span>
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
                    <span>© 2026 ORDERMGR</span>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
