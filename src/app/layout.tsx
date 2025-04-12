import "@/css/satoshi.css";
import "@/css/style.css";
import React from "react";
import { Provider } from "@/components/Provider/Provider";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const metadata: Metadata = {
  title: "Streamify",
  description: "Stream your favourite content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Provider>
          <ToastContainer />
          {children}
        </Provider>
      </body>
    </html>
  );
}
