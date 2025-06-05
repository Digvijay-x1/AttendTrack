import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Navbar />

      <main className="flex-1 overflow-y-auto">
        <Outlet/>
      </main>
    </div>
  );
};

export default Layout;
