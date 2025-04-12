"use client";
import React from "react";
import dynamic from "next/dynamic";
import DefaultLayout from "../Layouts/admin/DefaultLayout";

const AdminPage: React.FC = () => {
  return (
    <>
      <DefaultLayout>
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
          dashboard
        </div>
      </DefaultLayout>
    </>
  );
};

export default AdminPage;
