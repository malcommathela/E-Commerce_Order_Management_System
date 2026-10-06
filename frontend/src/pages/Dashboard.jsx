import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { getOrders, getProducts, getInventory, getCustomers, getPayments } from '../api/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, lowStock: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [today] = useState(() => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oRes, pRes, iRes, cRes, payRes] = await Promise.all([
          getOrders(), getProducts(), getInventory(), getCustomers(), getPayments()
        ]);

        const orders = oRes.data || [];
        const products = pRes.data || [];
        const inventory = iRes.data || [];
        const customers = cRes.data || [];
        const payments = payRes.data || [];

        const revenue = payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
        const lowStock = inventory.filter((i) => (i.quantity_available || 0) < 10).length;

        setStats({
          orders: orders.length,
          revenue: revenue.toFixed(2),
          products: products.length,
          lowStock,
          customers: customers.length,
        });
        setRecentOrders(orders.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const orderColumns = [
    { key: 'order_id', label: 'Order ID' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'order_date', label: 'Date', render: (v) => v ? new Date(v).toLocaleDateString() : '—' },
    { key: 'status', label: 'Status', render: (v) => <StatusBadge status={v} /> },
    { key: 'total_amount', label: 'Total', render: (v) => `₹${v || 0}` },
  ];

  return (
    <div className="dashboard">
      <div className="dash-hero">
        <span className="dash-eyebrow">01 / Operations — {today} — System / Online</span>
        <h2 className="dash-title editorial-reveal"><span>Operations</span></h2>
        <p className="dash-sub">Everything moving through your commerce system.</p>
      </div>

      <div className="stats-grid">
        <StatCard index="01" title="Total Orders" value={stats.orders} />
        <StatCard index="02" title="Revenue" value={`₹${stats.revenue}`} />
        <StatCard index="03" title="Products" value={stats.products} />
        <StatCard index="04" title="Low Stock" value={String(stats.lowStock).padStart(2, '0')} trend={stats.lowStock > 0 ? 'Needs attention' : 'Levels healthy'} />
        <StatCard index="05" title="Customers" value={stats.customers} />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <span className="section-eyebrow">Latest movement</span>
          <h2>Recent Orders</h2>
        </div>
        <DataTable columns={orderColumns} data={recentOrders} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
