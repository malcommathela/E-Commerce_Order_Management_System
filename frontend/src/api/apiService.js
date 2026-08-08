import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Convert all object keys to lowercase (Oracle returns UPPERCASE)
const normalizeKeys = (obj) => {
  if (Array.isArray(obj)) return obj.map(normalizeKeys);
  if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k.toLowerCase(), normalizeKeys(v)])
    );
  }
  return obj;
};

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (res) => {
    // Unwrap backend envelope: { success: true, data: [...], count: N }
    let payload = res.data;
    if (payload && typeof payload === 'object' && 'data' in payload && 'success' in payload) {
      payload = payload.data;
    }
    // Normalize Oracle UPPERCASE keys to lowercase
    payload = normalizeKeys(payload);
    return { ...res, data: payload };
  },
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Network error';
    console.error('[API Error]', msg);
    return Promise.reject(msg);
  }
);

// ===== CUSTOMERS =====
export const getCustomers = () => api.get('/customers');
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// ===== SUPPLIERS =====
export const getSuppliers = () => api.get('/suppliers');
export const getSupplier = (id) => api.get(`/suppliers/${id}`);
export const createSupplier = (data) => api.post('/suppliers', data);
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data);
export const deleteSupplier = (id) => api.delete(`/suppliers/${id}`);

// ===== CATEGORIES =====
export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// ===== PRODUCTS =====
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const getProductsByCategory = (catId) => api.get(`/products/category/${catId}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ===== INVENTORY =====
export const getInventory = () => api.get('/inventory');
export const getInventoryItem = (id) => api.get(`/inventory/${id}`);
export const getInventoryByProduct = (pid) => api.get(`/inventory/product/${pid}`);
export const createInventory = (data) => api.post('/inventory', data);
export const updateInventory = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);

// ===== ORDERS =====
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getOrdersByCustomer = (cid) => api.get(`/orders/customer/${cid}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// ===== ORDER ITEMS =====
export const getOrderItems = () => api.get('/items');
export const getOrderItem = (id) => api.get(`/items/${id}`);
export const getOrderItemsByOrder = (oid) => api.get(`/items/order/${oid}`);
export const createOrderItem = (data) => api.post('/items', data);
export const updateOrderItem = (id, data) => api.put(`/items/${id}`, data);
export const deleteOrderItem = (id) => api.delete(`/items/${id}`);

// ===== PAYMENTS =====
export const getPayments = () => api.get('/payments');
export const getPayment = (id) => api.get(`/payments/${id}`);
export const getPaymentByOrder = (oid) => api.get(`/payments/order/${oid}`);
export const createPayment = (data) => api.post('/payments', data);
export const updatePayment = (id, data) => api.put(`/payments/${id}`, data);
export const deletePayment = (id) => api.delete(`/payments/${id}`);

// ===== HEALTH =====
export const healthCheck = () => api.get('/health', { baseURL: API_BASE.replace('/api','') });

export default api;
