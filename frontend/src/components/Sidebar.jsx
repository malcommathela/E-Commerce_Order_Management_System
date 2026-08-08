import React from 'react';
import { NavLink } from 'react-router-dom';
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

const Sidebar = () => (
  <aside className="sidebar">
    <div className="sidebar-brand">
      <span className="brand-icon">🛒</span>
      <span className="brand-text">OrderMgr</span>
    </div>
    <nav className="sidebar-nav">
      {navItems.map((item) => (
        <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
    <div className="sidebar-footer">
      <span>v1.0.0</span>
    </div>
  </aside>
);

export default Sidebar;
