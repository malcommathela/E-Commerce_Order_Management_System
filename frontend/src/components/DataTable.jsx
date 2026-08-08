import React, { useState } from 'react';
import './DataTable.css';

const DataTable = ({ columns, data, onRowClick, actions, loading }) => {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [search, setSearch] = useState('');

  const safeData = Array.isArray(data) ? data : [];

  const handleSort = (key) => {
    if (sortCol === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortCol(key); setSortDir('asc'); }
  };

  const filtered = safeData.filter((row) =>
    columns.some((col) => {
      const val = String(row[col.key] ?? '').toLowerCase();
      return val.includes(search.toLowerCase());
    })
  );

  const sorted = sortCol
    ? [...filtered].sort((a, b) => {
        const av = a[sortCol] ?? '';
        const bv = b[sortCol] ?? '';
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      })
    : filtered;

  return (
    <div className="data-table-wrap">
      <div className="table-toolbar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="table-search"
        />
        <span className="table-count">{sorted.length} records</span>
      </div>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)} className={sortCol === col.key ? `sort-${sortDir}` : ''}>
                  {col.label}
                </th>
              ))}
              {actions && <th className="actions-col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="table-empty">Loading...</td></tr>
            ) : sorted.length === 0 ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="table-empty">No records found</td></tr>
            ) : (
              sorted.map((row, i) => (
                <tr key={i} onClick={() => onRowClick?.(row)} className={onRowClick ? 'clickable' : ''}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  {actions && <td className="actions-cell">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
