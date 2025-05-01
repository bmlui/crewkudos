"use client";
import "./globals.css";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import TopBar from "./components/TopBar";
import TopBarLoader from "./components/TopBarLoader"; // Ensure this path is correct

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBarLoader />
      <TopBar />
      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <AppLayout>{children}</AppLayout>
        </ClerkProvider>
      </body>
    </html>
  );
}
