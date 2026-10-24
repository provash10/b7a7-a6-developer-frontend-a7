import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AccessDenied() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex gap-3 items-center p-6 rounded-2xl bg-card border border-border shadow-xs max-w-md">
        <div className="bg-red-500/10 border border-red-500/20 rounded-full p-4 shrink-0">
          <ShieldAlert className="size-8 text-red-500" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            You do not have access to this page
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Go back to{" "}
            <Link href="/" className="text-primary underline font-medium hover:text-primary/80">
              home
            </Link>{" "}
            or log in with an authorized account.
          </p>
        </div>
      </div>
    </div>
  );
}
