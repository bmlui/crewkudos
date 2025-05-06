import "./globals.css";

import React from "react";
import { SessionProvider } from "next-auth/react";
import TopBar from "./components/TopBar";

export const metadata = {
  title: "Crew Kudos",
  description:
    "Kudos appreciation app for organizations, departments, and teams",
};

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
        <SessionProvider>
          <AppLayout>{children}</AppLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
