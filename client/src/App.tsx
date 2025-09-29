import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Layout
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import Assessment from './pages/Student/Assessment';
import Results from './pages/Student/Results';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import StudentList from './pages/Admin/StudentList';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Student Routes */}
        <Route 
          index 
          element={
            <ProtectedRoute requireRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/assessment" 
          element={
            <ProtectedRoute requireRole="student">
              <Assessment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/results" 
          element={
            <ProtectedRoute requireRole="student">
              <Results />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/students" 
          element={
            <ProtectedRoute requireRole="admin">
              <StudentList />
            </ProtectedRoute>
          } 
        />

        {/* Default redirect based on role */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={user?.role === 'admin' ? '/admin/dashboard' : '/'} 
              replace 
            />
          } 
        />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
