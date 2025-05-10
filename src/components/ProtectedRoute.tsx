import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserLayout from '../layouts/UserLayout';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return user ? (
    <UserLayout>
      <Outlet />
    </UserLayout>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;