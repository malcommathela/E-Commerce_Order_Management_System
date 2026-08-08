import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../api/apiService';
import './EntityPage.css';

const Categories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
      category_name: '',
      description: '',
  });
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
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
      category_name: '',
      description: '',
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
        await updateCategory(editing.category_id, formData);
      } else {
        await createCategory(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete Category #${row.category_id}?`)) return;
    try {
      await deleteCategory(row.category_id);
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  const columns = [
    { key: "category_id", label: "Category Id" },
    { key: "category_name", label: "Category Name" },
    { key: "description", label: "Description" }
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
        <h2>Categories</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Category</button>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <DataTable columns={columns} data={data} actions={actions} loading={loading} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit Category` : `New Category`} size="md">
        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label>Name *</label>
            <input type="text" name="category_name" value={formData.category_name || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input type="text" name="description" value={formData.description || ""} onChange={handleChange} required={false} />
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

export default Categories;
