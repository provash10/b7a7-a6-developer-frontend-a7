"use client";

import { User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "RECRUITER" | "ADMIN";
  status: "ACTIVE" | "BLOCKED" | "PENDING";
  createdAt: string;
  assessmentsCount: number;
}

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ManagedUser | null;
  onSave: (updated: ManagedUser) => void;
}

export function UserEditModal({
  isOpen,
  onClose,
  user,
  onSave,
}: UserEditModalProps) {
  // console.log("user edit modal rendered", user?.id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"CANDIDATE" | "RECRUITER" | "ADMIN">(
    "CANDIDATE",
  );
  const [status, setStatus] = useState<"ACTIVE" | "BLOCKED" | "PENDING">(
    "ACTIVE",
  );

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setStatus(user.status);
    } else {
      setName("");
      setEmail("");
      setRole("CANDIDATE");
      setStatus("ACTIVE");
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    // console.log("saving user edit details", name);
    onSave({
      id: user ? user.id : `usr-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role,
      status,
      createdAt: user ? user.createdAt : "Just now",
      assessmentsCount: user ? user.assessmentsCount : 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl space-y-5">
        {/* modal header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/60">
          <div className="flex items-center gap-2 text-foreground font-semibold text-base">
            <User className="size-4 text-primary" />
            <span>{user ? "edit user account" : "create new user"}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* edit form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* name field */}
          <div className="space-y-1.5">
            <label htmlFor="user-name" className="font-medium text-foreground">
              full name
            </label>
            <Input
              id="user-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Provash Kumar"
              required
            />
          </div>

          {/* email field */}
          <div className="space-y-1.5">
            <label htmlFor="user-email" className="font-medium text-foreground">
              email address
            </label>
            <Input
              id="user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@domain.com"
              required
            />
          </div>

          {/* role selection */}
          <div className="space-y-1.5">
            <label htmlFor="user-role" className="font-medium text-foreground">
              account role
            </label>
            <select
              id="user-role"
              value={role}
              onChange={(e) =>
                setRole(e.target.value as "CANDIDATE" | "RECRUITER" | "ADMIN")
              }
              className="w-full h-8 px-2.5 rounded-none border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="CANDIDATE">
                Candidate (Developer / Test Taker)
              </option>
              <option value="RECRUITER">Recruiter (Company / Evaluator)</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>

          {/* status selection */}
          <div className="space-y-1.5">
            <label
              htmlFor="user-status"
              className="font-medium text-foreground"
            >
              account status
            </label>
            <select
              id="user-status"
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "ACTIVE" | "BLOCKED" | "PENDING")
              }
              className="w-full h-8 px-2.5 rounded-none border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="ACTIVE">Active (Verified Access)</option>
              <option value="PENDING">Pending Verification</option>
              <option value="BLOCKED">Blocked (Restricted)</option>
            </select>
          </div>

          {/* actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
            <Button type="button" variant="outline" size="xs" onClick={onClose}>
              cancel
            </Button>
            <Button type="submit" size="xs" className="gap-1">
              <span>{user ? "save changes" : "create account"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
