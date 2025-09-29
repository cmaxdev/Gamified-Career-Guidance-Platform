import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Header />}
      <main className={isAuthenticated ? 'pt-0' : ''}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
