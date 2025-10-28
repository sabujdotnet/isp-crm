import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Billing from './pages/Billing';
import Invoices from './pages/Invoices';
import MikroTik from './pages/MikroTik';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/clients" element={
            <PrivateRoute>
              <Layout>
                <Clients />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/billing" element={
            <PrivateRoute>
              <Layout>
                <Billing />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/invoices" element={
            <PrivateRoute>
              <Layout>
                <Invoices />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/mikrotik" element={
            <PrivateRoute>
              <Layout>
                <MikroTik />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/settings" element={
            <PrivateRoute>
              <Layout>
                <Settings />
              </Layout>
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;