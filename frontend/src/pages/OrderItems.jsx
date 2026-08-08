import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import { getOrderItems, getOrderItem, createOrderItem, updateOrderItem, deleteOrderItem } from '../api/apiService';
import './EntityPage.css';

const OrderItems = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
      order_id: '',
      product_id: '',
      quantity: '',
      unit_price: '',
  });
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getOrderItems();
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
      product_id: '',
      quantity: '',
      unit_price: '',
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
        await updateOrderItem(editing.order_item_id, formData);
      } else {
        await createOrderItem(formData);
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      setError(String(e));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete Order Item #${row.order_item_id}?`)) return;
    try {
      await deleteOrderItem(row.order_item_id);
      fetchData();
    } catch (e) {
      alert(String(e));
    }
  };

  const columns = [
    { key: "order_item_id", label: "Order Item Id" },
    { key: "order_id", label: "Order Id" },
    { key: "product_name", label: "Product Name" },
    { key: "quantity", label: "Quantity" },
    { key: "unit_price", label: "Unit Price", render: (v) => `₹${v || 0}` }
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
        <h2>OrderItems</h2>
        <button className="btn-primary" onClick={openCreate}>+ Add Order Item</button>
      </div>
      {error && <div className="alert-error">{error}</div>}
      <DataTable columns={columns} data={data} actions={actions} loading={loading} />
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? `Edit Order Item` : `New Order Item`} size="md">
        <form onSubmit={handleSubmit} className="entity-form">
          <div className="form-group">
            <label>Order ID *</label>
            <input type="number" name="order_id" value={formData.order_id || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Product ID *</label>
            <input type="number" name="product_id" value={formData.product_id || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Quantity *</label>
            <input type="number" name="quantity" value={formData.quantity || ""} onChange={handleChange} required={true} />
          </div>
          <div className="form-group">
            <label>Unit Price *</label>
            <input type="number" name="unit_price" value={formData.unit_price || ""} onChange={handleChange} required={true} />
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

export default OrderItems;
