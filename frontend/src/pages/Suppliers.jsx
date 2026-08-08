import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getSuppliers, getSupplier, createSupplier, updateSupplier, deleteSupplier } from '../api/apiService';
import './EntityPage.css';

const Suppliers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
      supplier_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
  });
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getSuppliers();
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
      supplier_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
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
        await updateSupplier(editing.supplier_id, formData);
      } else {
        await createSupplier(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete Supplier #${row.supplier_id}?`)) return;
    try {
      await deleteSupplier(row.supplier_id);
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  const columns = [
    { key: "supplier_id", label: "Supplier Id" },
    { key: "supplier_name", label: "Supplier Name" },
    { key: "contact_person", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" }
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
        <h2>Suppliers</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Supplier</button>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <DataTable columns={columns} data={data} actions={actions} loading={loading} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit Supplier` : `New Supplier`} size="md">
        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label>Name *</label>
            <input type="text" name="supplier_name" value={formData.supplier_name || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Contact Person</label>
            <input type="text" name="contact_person" value={formData.contact_person || ""} onChange={handleChange} required={false} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email || ""} onChange={handleChange} required={false} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone || ""} onChange={handleChange} required={false} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" value={formData.address || ""} onChange={handleChange} required={false} />
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

export default Suppliers;
