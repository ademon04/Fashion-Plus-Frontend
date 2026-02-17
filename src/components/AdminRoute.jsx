import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotFound from './UI/NotFound';

const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading-spinner">Cargando...</div>;
  }

  if (!isAdmin) {
    return <NotFound />;
  }

  return children;
};

export default AdminRoute;