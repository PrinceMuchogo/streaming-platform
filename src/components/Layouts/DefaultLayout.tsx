"use client";
import React, { useState, ReactNode } from "react";
import RightSidebar from "../Sidebar/RightSideBar";
import LeftSidebar from "../Sidebar/LeftSidebar";
import MobileRightSidebar from "../Sidebar/MobileSideBar";
import Header from "@/components/Header";
import Footer from "../Footer";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <>
      {/* <!-- ===== Page Wrapper Star ===== --> */}
      <div className="dark flex h-screen overflow-hidden bg-black ">
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
            <div className="mx-auto max-w-screen-2xl bg-black pb-14 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}

        <RightSidebar />
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
