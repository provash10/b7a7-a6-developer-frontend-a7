"use client";

import { useEffect } from "react";
import { clearActiveSession } from "@/lib/session";

export default function LogoutPage() {
  useEffect(() => {
    clearActiveSession();
    window.location.href = "/login?logout=true";
  }, []);

  return null;
}
