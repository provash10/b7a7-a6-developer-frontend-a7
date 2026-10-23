import { Check, Minus } from "lucide-react";
import { Fragment } from "react";
import { Badge } from "@/components/ui/badge";

const comparisonCategories = [
  {
    category: "Assessment Creation & Questions",
    features: [
      {
        name: "Active Assessments",
        starter: "3 Assessments",
        pro: "Unlimited",
        enterprise: "Unlimited",
      },
      {
        name: "Candidate Invitations",
        starter: "10 / month",
        pro: "200 / month included",
        enterprise: "Unlimited Custom",
      },
      {
        name: "Question Types",
        starter: "CODING & MCQ",
        pro: "CODING, MCQ, DESCRIPTIVE",
        enterprise: "All + Custom Problem Banks",
      },
      {
        name: "Hidden Test Cases & Benchmarking",
        starter: false,
        pro: true,
        enterprise: true,
      },
      {
        name: "Custom Pass Marks & Cutoffs",
        starter: true,
        pro: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Proctoring & Anti-Cheat Engine",
    features: [
      {
        name: "Tab Switch / Window Blur Detection",
        starter: "Basic Event Notice",
        pro: "Real-time Telemetry Flags",
        enterprise: "Real-time Flags + Session Keystrokes",
      },
      {
        name: "Anti-Cheat Flags on Leaderboard",
        starter: false,
        pro: true,
        enterprise: true,
      },
      {
        name: "Code Plagiarism & Similarity Detection",
        starter: false,
        pro: false,
        enterprise: true,
      },
      {
        name: "Tokenized Invitation Links (Expiring)",
        starter: true,
        pro: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Scoring, Leaderboards & Recruitment",
    features: [
      {
        name: "Automated Sandbox Execution",
        starter: true,
        pro: true,
        enterprise: true,
      },
      {
        name: "Dynamic Recruiter Leaderboard",
        starter: false,
        pro: true,
        enterprise: true,
      },
      {
        name: "Candidate Submission Code Diffs",
        starter: false,
        pro: true,
        enterprise: true,
      },
      {
        name: "Export Candidate Scores to CSV",
        starter: false,
        pro: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Payment, Team & Support",
    features: [
      {
        name: "Payment Gateways",
        starter: "Free Tier",
        pro: "bKash & Stripe Checkout",
        enterprise: "bKash, Cards & Custom Invoicing",
      },
      {
        name: "Live Collaborative Interview Suite",
        starter: false,
        pro: "Optional Add-on",
        enterprise: "Included",
      },
      {
        name: "Support SLA",
        starter: "Community & Docs",
        pro: "Priority Email & Desk",
        enterprise: "Dedicated Manager (99.9% SLA)",
      },
    ],
  },
];

export default function PricingComparisonTable() {
  // console.log("pricing comparison table rendered");
  return (
    <section className="py-16 border-t border-border/60 bg-muted/10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <Badge
            variant="outline"
            className="gap-1.5 px-3 py-1 font-semibold text-primary border-primary/30 bg-primary/5"
          >
            Detailed Specification
          </Badge>
          <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Compare Plan Capabilities
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            A granular breakdown of features across our assessment and
            proctoring tiers.
          </p>
        </div>

        {/* comparison table container */}
        <div className="rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-muted/40 font-semibold text-foreground">
                <th className="p-4 sm:p-5 w-2/5">Platform Feature</th>
                <th className="p-4 sm:p-5 text-center w-1/5">Starter</th>
                <th className="p-4 sm:p-5 text-center w-1/5 bg-primary/5 text-primary">
                  Professional
                </th>
                <th className="p-4 sm:p-5 text-center w-1/5">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonCategories.map((cat) => (
                <Fragment key={cat.category}>
                  {/* category header row */}
                  <tr className="border-b border-border/60 bg-muted/20 font-bold text-[11px] uppercase tracking-wider text-muted-foreground">
                    <td colSpan={4} className="p-3 sm:px-5">
                      {cat.category}
                    </td>
                  </tr>

                  {/* features inside category */}
                  {cat.features.map((feat) => (
                    <tr
                      key={feat.name}
                      className="border-b border-border/50 hover:bg-muted/10 transition-colors"
                    >
                      <td className="p-4 sm:p-5 font-medium text-foreground">
                        {feat.name}
                      </td>

                      {/* starter cell */}
                      <td className="p-4 sm:p-5 text-center text-muted-foreground">
                        {typeof feat.starter === "boolean" ? (
                          feat.starter ? (
                            <Check className="size-4 mx-auto text-emerald-500" />
                          ) : (
                            <Minus className="size-4 mx-auto text-muted-foreground/40" />
                          )
                        ) : (
                          feat.starter
                        )}
                      </td>

                      {/* pro cell */}
                      <td className="p-4 sm:p-5 text-center bg-primary/5 font-semibold text-foreground">
                        {typeof feat.pro === "boolean" ? (
                          feat.pro ? (
                            <Check className="size-4 mx-auto text-emerald-500" />
                          ) : (
                            <Minus className="size-4 mx-auto text-muted-foreground/40" />
                          )
                        ) : (
                          feat.pro
                        )}
                      </td>

                      {/* enterprise cell */}
                      <td className="p-4 sm:p-5 text-center text-muted-foreground">
                        {typeof feat.enterprise === "boolean" ? (
                          feat.enterprise ? (
                            <Check className="size-4 mx-auto text-emerald-500" />
                          ) : (
                            <Minus className="size-4 mx-auto text-muted-foreground/40" />
                          )
                        ) : (
                          feat.enterprise
                        )}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
