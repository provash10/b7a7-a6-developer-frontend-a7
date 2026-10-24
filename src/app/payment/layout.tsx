import type React from "react";
import Footer from "@/components/layout/public/Footer";
import Header from "@/components/layout/public/Header";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-10 sm:py-16 px-4">{children}</main>
      <Footer />
    </div>
  );
}
