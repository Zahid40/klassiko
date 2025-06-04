import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import React from "react";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen mx-auto bg-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
