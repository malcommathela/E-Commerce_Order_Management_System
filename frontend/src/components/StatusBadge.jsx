import React from 'react';
import './StatusBadge.css';

const GLYPHS = {
  pending: '●',
  confirmed: '●',
  completed: '✓',
  delivered: '✓',
  shipped: '→',
  cancelled: '×',
  failed: '×',
  refunded: '↩',
};

const StatusBadge = ({ status }) => {
  const key = (status || '').toLowerCase();
  const done = ['delivered', 'completed'].includes(key);
  const gone = ['cancelled', 'failed'].includes(key);
  return (
    <span className={`status-badge${done ? ' is-done' : ''}${gone ? ' is-void' : ''}`}>
      <span className="status-glyph" aria-hidden="true">{GLYPHS[key] || '●'}</span>
      {status}
    </span>
  );
};

export default StatusBadge;
