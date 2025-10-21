import React, { useState } from 'react';
import NavSidebar from './NavSidebar';
import '../styles/MainLayout.css';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="crystal-main-layout">
      <NavSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="crystal-main-layout-content">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;