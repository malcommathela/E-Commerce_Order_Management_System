import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { getOrders, getProducts, getInventory, getCustomers, getPayments } from '../api/apiService';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, lowStock: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    { key: 'status', label: 'Status', render: (v) => (
      <span className={`badge badge-${(v || '').toLowerCase()}`}>{v}</span>
    )},
    { key: 'total_amount', label: 'Total', render: (v) => `₹${v || 0}` },
  ];

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatCard title="Total Orders" value={stats.orders} icon="📦" color="#3b82f6" />
        <StatCard title="Revenue" value={`₹${stats.revenue}`} icon="💰" color="#10b981" />
        <StatCard title="Products" value={stats.products} icon="🛍️" color="#8b5cf6" />
        <StatCard title="Low Stock" value={stats.lowStock} icon="⚠️" color="#f59e0b" trend={stats.lowStock > 0 ? 'Needs attention' : ''} />
        <StatCard title="Customers" value={stats.customers} icon="👥" color="#ec4899" />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Recent Orders</h2>
        </div>
        <DataTable columns={orderColumns} data={recentOrders} loading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
