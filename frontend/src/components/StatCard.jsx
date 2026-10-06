import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, index, trend }) => (
  <div className="stat-card">
    {index && <span className="stat-index">/{index}</span>}
    <span className="stat-title">{title}</span>
    <span className="stat-value">{value}</span>
    {trend && <span className="stat-trend">{trend}</span>}
  </div>
);

export default StatCard;
