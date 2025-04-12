"use client";
import React, { useState, ReactNode } from "react";
import LeftSidebar from "../Sidebar/LeftSidebar";
import Header from "@/components/Header";
import Footer from "../Footer";
import MobileRightSidebar from "../Sidebar/MobileSideBar";

export default function LeftBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <>
      {/* <!-- ===== Page Wrapper Star ===== --> */}
      <div className="dark bg-black flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Star ===== --> */}
        <LeftSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Star ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Star ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Star ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
        <MobileRightSidebar
          mobileSidebarOpen={isMobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}

      {/* <!-- ===== Footer Start ===== */}
      <Footer onSearchClick={() => setMobileSidebarOpen(true)} />
      {/* <!-- ===== Footer End ===== */}
    </>
  );
}
