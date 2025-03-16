import React from 'react';
import Navbar from './components/navbar/Navbar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto pt-4">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
