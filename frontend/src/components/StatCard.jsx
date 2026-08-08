import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="stat-icon" style={{ background: `${color}15`, color }}>{icon}</div>
    <div className="stat-info">
      <span className="stat-title">{title}</span>
      <span className="stat-value">{value}</span>
      {trend && <span className="stat-trend">{trend}</span>}
    </div>
  </div>
);

export default StatCard;
