import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getPayments, getPayment, createPayment, updatePayment, deletePayment } from '../api/apiService';
import './EntityPage.css';

const Payments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
      order_id: '',
      payment_date: '',
      amount: '',
      payment_method: '',
      status: '',
  });
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getPayments();
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
      order_id: '',
      payment_date: '',
      amount: '',
      payment_method: '',
      status: '',
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
        await updatePayment(editing.payment_id, formData);
      } else {
        await createPayment(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete Payment #${row.payment_id}?`)) return;
    try {
      await deletePayment(row.payment_id);
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  const columns = [
    { key: "payment_id", label: "Payment Id" },
    { key: "order_id", label: "Order Id" },
    { key: "payment_date", label: "Payment Date", render: (v) => v ? new Date(v).toLocaleDateString() : "—" },
    { key: "amount", label: "Amount", render: (v) => `₹${v || 0}` },
    { key: "payment_method", label: "Payment Method" },
    { key: "status", label: "Status", render: (v) => <span className={`badge badge-${(v || "").toLowerCase()}`}>{v}</span> }
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
        <h2>Payments</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Payment</button>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <DataTable columns={columns} data={data} actions={actions} loading={loading} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit Payment` : `New Payment`} size="md">
        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label>Order ID *</label>
            <input type="number" name="order_id" value={formData.order_id || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Payment Date *</label>
            <input type="date" name="payment_date" value={formData.payment_date || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Amount *</label>
            <input type="number" name="amount" value={formData.amount || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Method *</label>
            <select name="payment_method" value={formData.payment_method || ""} onChange={handleChange} required={true}>
              <option value="">Select...</option>
              {["UPI", "CREDIT_CARD", "DEBIT_CARD", "NET_BANKING", "CASH"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={formData.status || ""} onChange={handleChange} required={true}>
              <option value="">Select...</option>
              {["PENDING", "COMPLETED", "FAILED", "REFUNDED"].map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
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

export default Payments;
