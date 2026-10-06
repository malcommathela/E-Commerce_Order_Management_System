import React from 'react';
import './PageHeader.css';

const PageHeader = ({ index, title, description, countLabel, action }) => (
  <div className="page-header">
    <div className="page-header-top">
      <span className="page-eyebrow">{index} / {(title || '').toUpperCase()}</span>
    </div>
    <h2 className="page-title editorial-reveal"><span>{title}</span></h2>
    {description && <p className="page-description">{description}</p>}
    <div className="page-header-bar">
      <span className="page-count">{countLabel}</span>
      {action}
    </div>
  </div>
);

export default PageHeader;
