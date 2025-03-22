"use client"; // Ensure client-side rendering

import type { Metadata } from "next";
import "./globals.css";
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </body>
    </html>
  );
}
