import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../api/apiService';
import './EntityPage.css';

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
      product_name: '',
      category_id: '',
      supplier_id: '',
      price: '',
      description: '',
  });
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getProducts();
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
      product_name: '',
      category_id: '',
      supplier_id: '',
      price: '',
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
        await updateProduct(editing.product_id, formData);
      } else {
        await createProduct(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete Product #${row.product_id}?`)) return;
    try {
      await deleteProduct(row.product_id);
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  const columns = [
    { key: "product_id", label: "Product Id" },
    { key: "product_name", label: "Product Name" },
    { key: "category_name", label: "Category Name" },
    { key: "supplier_name", label: "Supplier Name" },
    { key: "price", label: "Price", render: (v) => `₹${v || 0}` }
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
        <h2>Products</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Product</button>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <DataTable columns={columns} data={data} actions={actions} loading={loading} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit Product` : `New Product`} size="md">
        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label>Name *</label>
            <input type="text" name="product_name" value={formData.product_name || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Category ID *</label>
            <input type="number" name="category_id" value={formData.category_id || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Supplier ID *</label>
            <input type="number" name="supplier_id" value={formData.supplier_id || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Price *</label>
            <input type="number" name="price" value={formData.price || ""} onChange={handleChange} required={true} />
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

export default Products;
