import type { Metadata } from "next";
import { Suspense } from "react";
import { PaymentSuccessCard } from "@/components/modules/payment";
import PaymentSuccessLoading from "./loading";

export const metadata: Metadata = {
  title: "Payment Successful & Official Tax Receipt | DevAssess",
  description:
    "Transaction confirmed. View your official bKash receipt, invoice breakdown, and recruiter assessment credits allocation.",
};

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <Suspense fallback={<PaymentSuccessLoading />}>
        <PaymentSuccessCard />
      </Suspense>
    </div>
  );
}
