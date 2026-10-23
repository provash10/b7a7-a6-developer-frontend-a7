import type { Metadata } from "next";
import {
  ContactFAQ,
  ContactForm,
  ContactHeader,
  ContactInfoCards,
} from "@/components/modules/contact";

export const metadata: Metadata = {
  title: "Contact & Developer Support | DevAssess",
  description:
    "Get in touch with DevAssess for technical assessment support, custom question bank curation, anti-cheat proctoring inquiries, and enterprise solutions.",
  openGraph: {
    title: "Contact & Developer Support | DevAssess",
    description:
      "24/7 dedicated support for recruiters, engineering leaders, and developers taking timed code assessments.",
  },
};

export default function ContactPage() {
  // console.log("contact page rendered");
  return (
    <div className="flex flex-col min-h-screen">
      {/* contact hero header */}
      <ContactHeader />

      {/* main content container */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            {/* left column: support channels & contact cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Support Channels
                </span>
                <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  We&apos;re Here to Support Your Hiring
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Reach out through any of our channels or send a direct inquiry
                  through the form.
                </p>
              </div>

              <ContactInfoCards />
            </div>

            {/* right column: direct message validated form (7 cols) */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* support faq section */}
      <ContactFAQ />
    </div>
  );
}
