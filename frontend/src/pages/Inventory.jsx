import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getInventory, createInventory, updateInventory, deleteInventory } from '../api/apiService';
import './EntityPage.css';

const Inventory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
      product_id: '',
      quantity_available: '',
      quantity_reserved: '',
      reorder_level: '',
  });
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getInventory();
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
      product_id: '',
      quantity_available: '',
      quantity_reserved: '',
      reorder_level: '',
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
        await updateInventory(editing.inventory_id, formData);
      } else {
        await createInventory(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete Inventory #${row.inventory_id}?`)) return;
    try {
      await deleteInventory(row.inventory_id);
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  const columns = [
    { key: "inventory_id", label: "Inventory Id" },
    { key: "product_name", label: "Product Name" },
    { key: "quantity_available", label: "Quantity Available" },
    { key: "quantity_reserved", label: "Quantity Reserved" },
    { key: "reorder_level", label: "Reorder Level" }
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
        <h2>Inventory</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Inventory</button>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <DataTable columns={columns} data={data} actions={actions} loading={loading} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit Inventory` : `New Inventory`} size="md">
        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label>Product ID *</label>
            <input type="number" name="product_id" value={formData.product_id || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Qty Available *</label>
            <input type="number" name="quantity_available" value={formData.quantity_available || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Qty Reserved</label>
            <input type="number" name="quantity_reserved" value={formData.quantity_reserved || ""} onChange={handleChange} required={false} />
          </div>
          <div className="form-group">
            <label>Reorder Level</label>
            <input type="number" name="reorder_level" value={formData.reorder_level || ""} onChange={handleChange} required={false} />
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

export default Inventory;
