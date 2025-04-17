import React from 'react';
import Navbar from './components/navbar/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="px-auto">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
