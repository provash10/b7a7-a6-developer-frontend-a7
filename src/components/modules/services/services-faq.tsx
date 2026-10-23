import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    q: "How does the Code Assessment engine evaluate candidate solutions?",
    a: "Candidates write code directly in the integrated online editor. When executing or submitting, the code runs in an isolated runner against predefined public and hidden test cases. Scores are calculated automatically based on test case pass ratios, runtime benchmarks, and memory consumption.",
  },
  {
    q: "How does anti-cheat and tab-switch detection work?",
    a: "During an active test attempt, our frontend monitors window blur and document visibility change events. Whenever a candidate navigates away or opens a new tab, an anti-cheat event is reported to the backend (`POST /attempt/:id/anti-cheat`) and increments the candidate's `antiCheatFlags` counter on the recruiter leaderboard.",
  },
  {
    q: "Can recruiters create custom questions and problem banks?",
    a: "Yes! Recruiters and Admins have full access to curate question banks. You can define CODING challenges with custom JSON test cases, randomized MCQ questions with single or multiple choice options, and open-ended DESCRIPTIVE questions categorized by Easy, Medium, or Hard difficulty.",
  },
  {
    q: "How do recruiters purchase assessment credits?",
    a: "Our backend integrates directly with the bKash tokenized payment gateway. Recruiters can purchase credit bundles on-demand to create new assessments and send candidate invitations.",
  },
  {
    q: "How are candidate invitations managed?",
    a: "Recruiters provide candidate emails and set expiration windows. The system generates unique, cryptographically signed invitation tokens (`inviteToken`) and sends templated email invitations via Nodemailer.",
  },
  {
    q: "Can I test the platform before inviting real candidates?",
    a: "Absolutely! You can use our One-Click Demo Login to sign in immediately as an Admin, Recruiter, or Candidate without manual registration.",
  },
];

export default function ServicesFAQ() {
  return (
    <section className="py-20 bg-background border-t border-border/60">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-semibold text-primary border-primary/30 bg-primary/5"
          >
            <HelpCircle className="size-3.5" />
            Frequently Asked Questions
          </Badge>
          <h2 className="mt-4 font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Questions About Our Services?
          </h2>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base">
            Everything you need to know about the Code Assessment architecture,
            test runner, and scoring.
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-xl border border-border/80 bg-card p-6 shadow-2xs transition-colors hover:border-primary/40"
            >
              <h3 className="font-heading text-base font-bold text-foreground">
                {faq.q}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
