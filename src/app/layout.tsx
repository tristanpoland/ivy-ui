// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DriveProvider } from '@/context/DriveContext';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ivy Vault - Secure Storage Management",
  description: "Manage and monitor your storage drives securely with Ivy Vault",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DriveProvider>
          {children}
        </DriveProvider>
      </body>
    </html>
  );
}