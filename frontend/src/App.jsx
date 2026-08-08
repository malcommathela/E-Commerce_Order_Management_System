import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Categories from './pages/Categories';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import OrderItems from './pages/OrderItems';
import Payments from './pages/Payments';
import './styles/global.css';

const App = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/" element={<Layout title="Dashboard"><Dashboard /></Layout>} />
      <Route path="/customers" element={<Layout title="Customers"><Customers /></Layout>} />
      <Route path="/suppliers" element={<Layout title="Suppliers"><Suppliers /></Layout>} />
      <Route path="/categories" element={<Layout title="Categories"><Categories /></Layout>} />
      <Route path="/products" element={<Layout title="Products"><Products /></Layout>} />
      <Route path="/inventory" element={<Layout title="Inventory"><Inventory /></Layout>} />
      <Route path="/orders" element={<Layout title="Orders"><Orders /></Layout>} />
      <Route path="/items" element={<Layout title="Order Items"><OrderItems /></Layout>} />
      <Route path="/payments" element={<Layout title="Payments"><Payments /></Layout>} />
    </Routes>
  </BrowserRouter>
);

export default App;
