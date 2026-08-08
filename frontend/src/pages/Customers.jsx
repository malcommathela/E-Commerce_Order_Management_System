import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer } from '../api/apiService';
import './EntityPage.css';

const Customers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
  });
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCustomers();
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
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
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
        await updateCustomer(editing.customer_id, formData);
      } else {
        await createCustomer(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete Customer #${row.customer_id}?`)) return;
    try {
      await deleteCustomer(row.customer_id);
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  const columns = [
    { key: "customer_id", label: "Customer Id" },
    { key: "first_name", label: "First Name" },
    { key: "last_name", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" }
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
        <h2>Customers</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Customer</button>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <DataTable columns={columns} data={data} actions={actions} loading={loading} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit Customer` : `New Customer`} size="md">
        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label>First Name *</label>
            <input type="text" name="first_name" value={formData.first_name || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Last Name *</label>
            <input type="text" name="last_name" value={formData.last_name || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} required={false} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={formData.address || ""} onChange={handleChange} required={false} />
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" value={formData.city || ""} onChange={handleChange} required={false} />
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" value={formData.state || ""} onChange={handleChange} required={false} />
          </div>
          <div className="form-group">
            <label>ZIP</label>
            <input type="text" name="zip_code" value={formData.zip_code || ""} onChange={handleChange} required={false} />
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

export default Customers;
