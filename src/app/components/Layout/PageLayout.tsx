


import React, { useState } from "react";
import Navbar from "../Navbar/index";
import Sidebar from "../Sidebar/index";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen relative">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}  />



      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Navbar toggleSidebar={toggleSidebar} navtitle="" />



        {/* Page Content */}
        <main className=" bg-gray-50 flex-1 overflow-y-auto bgMain">{children}</main>
      </div>
    </div>
  );
};

export default PageLayout;
