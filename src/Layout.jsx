import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { useApp } from "./context/AppContext";

const Layout = () => {
  const { sidebarOpen, theme } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
        isMobile 
          ? 'pt-16' // Add top padding for mobile header
          : sidebarOpen 
            ? 'ml-0' 
            : 'ml-0'
      }`}>
        <div className="p-4 md:p-6">
          <Outlet/>
        </div>
      </main>
    </div>
  );
};

export default Layout;
