import React from 'react';
import './Header.css';

const Header = ({ title }) => (
  <header className="app-header">
    <h1>{title}</h1>
    <div className="header-meta">
      <span className="status-dot"></span>
      <span className="status-text">System Online</span>
    </div>
  </header>
);

export default Header;
