"use client";

import { Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BuyCreditsModal } from "@/components/modules/payment";

interface BuyCreditsButtonProps {
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

export function BuyCreditsButton({ variant = "default", className }: BuyCreditsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setIsOpen(true)}
        className={`gap-2 font-semibold shadow-xs transition-all hover:scale-[1.02] cursor-pointer ${
          variant === "default"
            ? "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-pink-500/20"
            : ""
        } ${className || ""}`}
      >
        <Zap className="size-4 fill-current" />
        <span>Buy Assessment Credits</span>
      </Button>

      <BuyCreditsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
