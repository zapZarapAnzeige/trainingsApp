import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Breadcrumps from "@/components/Breadcrumps";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TrainingsApp",
  description: "An app to track fitness progression",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex bg-white">
          <Sidebar />
          <div className="flex flex-col flex-grow p-4">
            <Breadcrumps />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
