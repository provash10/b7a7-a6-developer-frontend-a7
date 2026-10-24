import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentCancelCard } from "@/components/modules/payment";
import PaymentCancelLoading from "./loading";

export const metadata: Metadata = {
  title: "Payment Cancelled or Failed | DevAssess",
  description:
    "Information regarding your cancelled bKash checkout transaction and options to retry.",
};

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto max-w-3xl">
      <Suspense fallback={<PaymentCancelLoading />}>
        <PaymentCancelCard />
      </Suspense>
    </div>
  );
}
