import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const contactFaqs = [
  {
    q: "How fast does your technical support team respond?",
    a: "For active, in-progress candidate evaluations, our on-call engineers respond within 15 minutes. General inquiries and billing support receive responses within 2 to 4 business hours.",
  },
  {
    q: "What should I do if a candidate loses connectivity during an assessment?",
    a: "Our backend automatically caches submitted answers and question progress. As a recruiter, you can view the candidate's attempt status in your dashboard and extend the duration timer or re-send an active token if necessary.",
  },
  {
    q: "Can I get assistance creating custom problem sets for our company?",
    a: "Yes! Our Enterprise and Premium recruiter tiers include dedicated problem curation support from senior software engineers who can design real-world debugging and algorithm challenges tailored to your tech stack.",
  },
  {
    q: "How do bKash payments work for recruiter assessment packages?",
    a: "Recruiters can buy credit bundles via automated bKash Tokenized Checkout directly inside the platform. Credits are deposited into your workspace immediately upon transaction completion.",
  },
];

export default function ContactFAQ() {
  // console.log("contact faq section rendered");
  return (
    <section className="py-16 border-t border-border/60 bg-muted/10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-semibold text-primary border-primary/30 bg-primary/5"
          >
            <HelpCircle className="size-3.5" />
            Support FAQ
          </Badge>
          <h2 className="mt-4 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Frequently Asked Support Questions
          </h2>
          <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
            Quick solutions to our most common recruiter and candidate
            questions.
          </p>
        </div>

        {/* faqs list */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {contactFaqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-border/80 bg-card p-5 shadow-2xs space-y-2 hover:border-primary/40 transition-colors"
            >
              <h3 className="font-heading text-sm font-bold text-foreground">
                {faq.q}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
