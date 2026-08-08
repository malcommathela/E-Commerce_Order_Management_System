import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getOrders, getOrder, createOrder, updateOrder, deleteOrder } from '../api/apiService';
import './EntityPage.css';

const Orders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
      customer_id: '',
      order_date: '',
      status: '',
      total_amount: '',
      shipping_address: '',
  });
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openCreate = () => {
    setEditing(null);
    setFormData({
      customer_id: '',
      order_date: '',
      status: '',
      total_amount: '',
      shipping_address: '',
    });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setFormData(row);
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await updateOrder(editing.order_id, formData);
      } else {
        await createOrder(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete Order #${row.order_id}?`)) return;
    try {
      await deleteOrder(row.order_id);
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  const columns = [
    { key: "order_id", label: "Order Id" },
    { key: "customer_name", label: "Customer Name" },
    { key: "order_date", label: "Order Date", render: (v) => v ? new Date(v).toLocaleDateString() : "—" },
    { key: "status", label: "Status", render: (v) => <span className={`badge badge-${(v || "").toLowerCase()}`}>{v}</span> },
    { key: "total_amount", label: "Total Amount", render: (v) => `₹${v || 0}` }
  ];

  const actions = (row) => (
    <>
      <button className="btn-icon btn-edit" onClick={() => openEdit(row)}>Edit</button>
      <button className="btn-icon btn-delete" onClick={() => handleDelete(row)}>Delete</button>
    </>
  );

  return (
    <div className="entity-page">
      <div className="page-header">
        <h2>Orders</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Order</button>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <DataTable columns={columns} data={data} actions={actions} loading={loading} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit Order` : `New Order`} size="md">
        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label>Customer ID *</label>
            <input type="number" name="customer_id" value={formData.customer_id || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Order Date *</label>
            <input type="date" name="order_date" value={formData.order_date || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={formData.status || ""} onChange={handleChange} required={true}>
              <option value="">Select...</option>
              {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Total Amount *</label>
            <input type="number" name="total_amount" value={formData.total_amount || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Shipping Address</label>
            <input type="text" name="shipping_address" value={formData.shipping_address || ""} onChange={handleChange} required={false} />
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">{editing ? "Update" : "Create"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Orders;
