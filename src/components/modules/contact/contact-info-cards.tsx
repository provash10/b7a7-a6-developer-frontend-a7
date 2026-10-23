import {
  Mail,
  MapPin,
  MessageSquareCode,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const contactChannels = [
  {
    icon: Mail,
    title: "Technical Support",
    subtitle: "Active Assessment Help",
    value: "support@devassess.io",
    detail: "Average response under 15 minutes during live assessments.",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: MessageSquareCode,
    title: "Sales & Enterprise",
    subtitle: "Custom Question Banks",
    value: "enterprise@devassess.io",
    detail: "Tailored problem banks, volume bKash credits & SLA.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    icon: PhoneCall,
    title: "Hotline Support",
    subtitle: "Emergency Exam Desk",
    value: "+880 1700-123456",
    detail: "Available Sunday - Thursday, 9:00 AM - 8:00 PM BST.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: MapPin,
    title: "Headquarters",
    subtitle: "Engineering Office",
    value: "Banani, Dhaka - 1213",
    detail: "Bangladesh • Global cloud infrastructure on AWS & Vercel.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

export default function ContactInfoCards() {
  // console.log("contact info cards rendered");
  return (
    <div className="space-y-6">
      {/* channels grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {contactChannels.map((channel) => {
          const Icon = channel.icon;
          return (
            <Card
              key={channel.title}
              className="border border-border/80 bg-card transition-all hover:border-primary/40 hover:shadow-xs"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${channel.bgColor}`}>
                    <Icon className={`size-5 ${channel.color}`} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {channel.subtitle}
                    </span>
                    <CardTitle className="text-base text-foreground">
                      {channel.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-1">
                <p className="font-mono text-sm font-semibold text-primary">
                  {channel.value}
                </p>
                <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                  {channel.detail}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* live support notice banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <ShieldCheck className="size-4 text-primary" />
          <span>Need Instant Assistance for an Ongoing Test Attempt?</span>
        </div>
        <p className="leading-relaxed">
          If a candidate experiences an unexpected browser crash or network drop
          during a timed evaluation, recruiters can re-issue tokens or inspect
          live antiCheatFlags via the recruiter dashboard.
        </p>
      </div>
    </div>
  );
}
