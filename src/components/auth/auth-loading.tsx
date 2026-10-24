import { LoaderIcon } from "lucide-react";

export default function AuthLoading({
  label = "Verifying account",
}: {
  label?: string;
}) {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
        <LoaderIcon className="size-5 animate-spin text-primary" />
        <span>{label}</span>
      </div>
    </div>
  );
}
