import React from 'react';
import './Header.css';

const routeIndex = {
  Dashboard: '01',
  Orders: '02',
  Products: '03',
  Inventory: '04',
  Customers: '05',
  Payments: '06',
  Suppliers: '07',
  Categories: '08',
  'Order Items': '09',
};

const Header = ({ title }) => (
  <header className="app-header">
    <div>
      <div className="app-header-index">{routeIndex[title] || '00'} / {(title || '').toUpperCase()}</div>
      <h1>{title}</h1>
    </div>
    <div className="header-meta">
      <span className="sys-mark" aria-hidden="true"></span>
      <span>System / Online</span>
    </div>
  </header>
);

export default Header;
