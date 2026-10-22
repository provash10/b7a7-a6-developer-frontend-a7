import type React from "react";
import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header></Header>
      <main className="flex-1">{children}</main>
      <Footer></Footer>
    </div>
  );
}
