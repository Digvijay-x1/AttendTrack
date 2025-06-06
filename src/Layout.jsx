import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import { useApp } from "./context/AppContext";

const Layout = () => {
  const { sidebarOpen, theme } = useApp();
  
  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Navbar />

      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-0' : 'ml-0'}`}>
        <Outlet/>
      </main>
    </div>
  );
};

export default Layout;
