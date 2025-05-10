import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/user/UserDashboard';
import BookCatalog from './pages/user/BookCatalog';
import BookDetails from './pages/user/BookDetails';
import UserProfile from './pages/user/UserProfile';
import PaymentPage from './pages/user/PaymentPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBooks from './pages/admin/ManageBooks';
import ManageUsers from './pages/admin/ManageUsers';
import ManageDues from './pages/admin/ManageDues';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/books" element={<BookCatalog />} />
              <Route path="/user/books/:id" element={<BookDetails />} />
              <Route path="/user/profile" element={<UserProfile />} />
              <Route path="/user/payment" element={<PaymentPage />} />
            </Route>
            
            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/books" element={<ManageBooks />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/dues" element={<ManageDues />} />
            </Route>
            
            {/* Redirect and Not Found Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;