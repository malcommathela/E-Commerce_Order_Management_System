import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
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
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected app routes */}
          <Route path="/" element={
            <ProtectedRoute><Layout title="Dashboard"><Dashboard /></Layout></ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute><Layout title="Customers"><Customers /></Layout></ProtectedRoute>
          } />
          <Route path="/suppliers" element={
            <ProtectedRoute><Layout title="Suppliers"><Suppliers /></Layout></ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute><Layout title="Categories"><Categories /></Layout></ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute><Layout title="Products"><Products /></Layout></ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute><Layout title="Inventory"><Inventory /></Layout></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Layout title="Orders"><Orders /></Layout></ProtectedRoute>
          } />
          <Route path="/items" element={
            <ProtectedRoute><Layout title="Order Items"><OrderItems /></Layout></ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute><Layout title="Payments"><Payments /></Layout></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
);

export default App;