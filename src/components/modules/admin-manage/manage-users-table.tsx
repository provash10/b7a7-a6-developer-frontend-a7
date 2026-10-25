"use client";

import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { getActiveUserEmail } from "@/lib/session";
import apiClient from "@/lib/apiClient";
import { type ManagedUser, UserEditModal } from "./user-edit-modal";

const INITIAL_USERS: ManagedUser[] = [
  {
    id: "usr-admin-100",
    name: "System Admin",
    email: "admin@100.com",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "Demo Account",
    assessmentsCount: 0,
  },
  {
    id: "usr-recruiter-100",
    name: "Jane Recruiter",
    email: "recruiter@100.com",
    role: "RECRUITER",
    status: "ACTIVE",
    createdAt: "Demo Account",
    assessmentsCount: 12,
  },
  {
    id: "usr-cand-100",
    name: "Candidate Demo User",
    email: "candidate@100.com",
    role: "CANDIDATE",
    status: "ACTIVE",
    createdAt: "Demo Account",
    assessmentsCount: 4,
  },
];

export function ManageUsersTable() {
  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  // Load real users from database and merge with custom users
  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      // 1. Read custom registered users from localStorage and purge any old dummy emails
      const dummyEmails = new Set([
        "user@devassess.com",
        "sarah@techcorp.io",
        "tariqul.dev@gmail.com",
        "farhana.ui@yahoo.com",
        "admin@devassess.io",
        "shahriar.eng@outlook.com",
        "david@pixelcraft.studio",
        "candidate-1@100.com",
        "recruiter-1@100.com",
        "admin-1@100.com",
        "recruiter-2@100.com",
        "candidate1ew-1@100.com",
        "admin-2@100.com",
        "rahim@gmail.com",
        "karim@gmail.com",
        "pintu@gmail.com",
        "lina@gmail.com",
      ]);

      let customUsers: ManagedUser[] = [];
      try {
        const stored = localStorage.getItem("devassess_custom_users");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            customUsers = parsed.filter(
              (u: ManagedUser) =>
                !dummyEmails.has(u.email.toLowerCase().trim()),
            );
            localStorage.setItem(
              "devassess_custom_users",
              JSON.stringify(customUsers),
            );
          }
        }
      } catch {}

      // 2. Fetch live users from backend database API (with limit=100 to get all users)
      try {
        const res = await apiClient<any>("/users?limit=100");
        const apiUsers: any[] = res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(apiUsers) && apiUsers.length > 0 && isMounted) {
          const dbUsers: ManagedUser[] = apiUsers.map((u: any) => ({
            id: u.id,
            name: u.name || u.email?.split("@")[0] || "User",
            email: u.email,
            role: (u.role || "CANDIDATE").toUpperCase() as "CANDIDATE" | "RECRUITER" | "ADMIN",
            status: "ACTIVE",
            createdAt: u.createdAt
              ? new Date(u.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently",
            assessmentsCount: 0,
          }));

          setUsers(() => {
            const map = new Map<string, ManagedUser>();
            // Add real DB users
            for (const u of dbUsers) {
              map.set(u.email.toLowerCase().trim(), u);
            }
            // Add any newly created local users
            for (const u of customUsers) {
              map.set(u.email.toLowerCase().trim(), u);
            }
            return Array.from(map.values());
          });
          return;
        }
      } catch {
        // Backend /users call might fail if offline or not logged in as admin yet
      }

      // 3. Fallback: merge localStorage with initial list if DB unavailable
      if (isMounted) {
        setUsers(() => {
          const map = new Map<string, ManagedUser>();
          for (const u of INITIAL_USERS) {
            map.set(u.email.toLowerCase().trim(), u);
          }
          for (const u of customUsers) {
            map.set(u.email.toLowerCase().trim(), u);
          }
          return Array.from(map.values());
        });
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  // deduplicate users list
  const sanitizedUsers = useMemo(() => {
    const seen = new Set<string>();
    return users.filter((u) => {
      const email = u.email.toLowerCase().trim();
      if (!email || seen.has(email)) return false;
      seen.add(email);
      return true;
    });
  }, [users]);

  // filter users
  const filteredUsers = useMemo(() => {
    return sanitizedUsers.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [sanitizedUsers, searchQuery, roleFilter, statusFilter]);

  // paginated items
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // toggle block / active
  const handleToggleBlock = (user: ManagedUser) => {
    const newStatus: "ACTIVE" | "BLOCKED" =
      user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";

    setUsers((prev) => {
      const next = prev.map((u) =>
        u.id === user.id ? { ...u, status: newStatus } : u,
      );
      try {
        localStorage.setItem("devassess_custom_users", JSON.stringify(next));
      } catch {}
      return next;
    });

    toast.add({
      title: newStatus === "BLOCKED" ? "User Blocked" : "User Unblocked",
      description: `${user.name} is now ${newStatus.toLowerCase()}.`,
      type: newStatus === "BLOCKED" ? "destructive" : "success",
    });
  };

  // delete user
  const handleDeleteUser = (user: ManagedUser) => {
    setUsers((prev) => {
      const next = prev.filter((u) => u.id !== user.id);
      try {
        localStorage.setItem("devassess_custom_users", JSON.stringify(next));
      } catch {}
      return next;
    });

    toast.add({
      title: "User Removed",
      description: `Account for ${user.name} has been deleted.`,
      type: "success",
    });
  };

  // save / create user from modal
  const handleSaveUser = async (updated: ManagedUser) => {
    // 1. Immediately update UI state
    setUsers((prev) => {
      const exists = prev.some(
        (u) =>
          u.id === updated.id ||
          u.email.toLowerCase().trim() === updated.email.toLowerCase().trim(),
      );
      if (exists) {
        return prev.map((u) =>
          u.id === updated.id ||
          u.email.toLowerCase().trim() === updated.email.toLowerCase().trim()
            ? updated
            : u,
        );
      }
      return [updated, ...prev];
    });

    const cleanEmail = updated.email.toLowerCase().trim().replace(/[@.]/g, "_");
    try {
      document.cookie = `role_${cleanEmail}=${updated.role}; path=/; max-age=31536000;`;
      if (updated.email.toLowerCase().includes("candidate")) {
        document.cookie = `role_candidate_100_com=${updated.role}; path=/; max-age=31536000;`;
      }

      const activeEmail = getActiveUserEmail();
      if (
        !activeEmail ||
        activeEmail === updated.email.toLowerCase().trim() ||
        updated.email.toLowerCase().includes("candidate")
      ) {
        document.cookie = `userRole=${updated.role}; path=/; max-age=31536000;`;
      }

      window.dispatchEvent(
        new CustomEvent("devassess_role_change", {
          detail: { email: updated.email, role: updated.role },
        }),
      );

      const stored = localStorage.getItem("devassess_custom_users");
      let customUsers: ManagedUser[] = stored ? JSON.parse(stored) : [];
      const customIdx = customUsers.findIndex(
        (cu) =>
          cu.email.toLowerCase().trim() === updated.email.toLowerCase().trim(),
      );
      if (customIdx >= 0) {
        customUsers[customIdx] = updated;
      } else {
        customUsers.unshift(updated);
      }
      localStorage.setItem(
        "devassess_custom_users",
        JSON.stringify(customUsers),
      );
    } catch {}

    // 2. Persist to PostgreSQL Database via API
    try {
      let roleSaved = false;
      try {
        await apiClient(`/users/${encodeURIComponent(updated.id)}/role`, {
          method: "PATCH",
          body: { role: updated.role },
        });
        roleSaved = true;
      } catch {
        // Fallback: try by email in case updated.id is a demo alias like usr-cand-100
        await apiClient(`/users/${encodeURIComponent(updated.email)}/role`, {
          method: "PATCH",
          body: { role: updated.role },
        });
        roleSaved = true;
      }

      if (roleSaved) {
        toast.add({
          title: "Role Updated in Database",
          description: `${updated.name}'s role is now ${updated.role} in PostgreSQL.`,
          type: "success",
        });
      }
    } catch (err: any) {
      console.warn("Could not sync role to backend database:", err);
      toast.add({
        title: "Role Updated Locally",
        description: `${updated.name}'s role was updated to ${updated.role}.`,
        type: "success",
      });
    }
  };

  return (
    <Card className="border-border/80 bg-card shadow-xs">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider mb-0.5">
              <Users className="size-3.5" />
              <span>identity directory</span>
            </div>
            <CardTitle className="text-base font-semibold text-foreground">
              user accounts & roles
            </CardTitle>
            <CardDescription className="text-xs">
              search, filter, assign system permissions, and audit candidates &
              recruiters.
            </CardDescription>
          </div>

          <Button
            size="xs"
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="gap-1.5 self-start sm:self-auto"
          >
            <UserPlus className="size-3.5" />
            <span>add user</span>
          </Button>
        </div>

        {/* filter and search controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
          {/* search */}
          <div className="relative">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="search user name or email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 text-xs h-8"
            />
          </div>

          {/* role filter */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-8 px-2.5 rounded-none border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">
              All Roles (Candidates, Recruiters, Admins)
            </option>
            <option value="CANDIDATE">Candidates Only</option>
            <option value="RECRUITER">Recruiters Only</option>
            <option value="ADMIN">Administrators Only</option>
          </select>

          {/* status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-8 px-2.5 rounded-none border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Statuses (Active, Pending, Blocked)</option>
            <option value="ACTIVE">Active Users</option>
            <option value="PENDING">Pending Verification</option>
            <option value="BLOCKED">Blocked Accounts</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground">
              <tr>
                <th className="py-3 px-4 font-medium">user</th>
                <th className="py-3 px-4 font-medium">role</th>
                <th className="py-3 px-4 font-medium">status</th>
                <th className="py-3 px-4 font-medium">tests / activity</th>
                <th className="py-3 px-4 font-medium">joined</th>
                <th className="py-3 px-4 font-medium text-right">actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    no users found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* user identity */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                          {u.name.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground leading-tight">
                            {u.name}
                          </p>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* role badge */}
                    <td className="py-3 px-4">
                      {u.role === "ADMIN" && (
                        <Badge variant="default" className="text-[10px]">
                          admin
                        </Badge>
                      )}
                      {u.role === "RECRUITER" && (
                        <Badge variant="amber" className="text-[10px]">
                          recruiter
                        </Badge>
                      )}
                      {u.role === "CANDIDATE" && (
                        <Badge variant="outline" className="text-[10px]">
                          candidate
                        </Badge>
                      )}
                    </td>

                    {/* status badge */}
                    <td className="py-3 px-4">
                      {u.status === "ACTIVE" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="size-3" />
                          active
                        </span>
                      )}
                      {u.status === "BLOCKED" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                          <Ban className="size-3" />
                          blocked
                        </span>
                      )}
                      {u.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                          pending
                        </span>
                      )}
                    </td>

                    {/* tests count */}
                    <td className="py-3 px-4 text-muted-foreground">
                      {u.assessmentsCount}{" "}
                      {u.role === "RECRUITER" ? "created" : "taken"}
                    </td>

                    {/* joined date */}
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {u.createdAt}
                    </td>

                    {/* actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => {
                            setEditingUser(u);
                            setIsModalOpen(true);
                          }}
                          title="edit user"
                        >
                          <Edit2 className="size-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleToggleBlock(u)}
                          title={
                            u.status === "BLOCKED"
                              ? "unblock user"
                              : "block user"
                          }
                        >
                          {u.status === "BLOCKED" ? (
                            <UserCheck className="size-3.5 text-emerald-500" />
                          ) : (
                            <Ban className="size-3.5 text-amber-500" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDeleteUser(u)}
                          title="delete user"
                        >
                          <Trash2 className="size-3.5 text-rose-500 hover:text-rose-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 text-xs text-muted-foreground">
          <span>
            showing{" "}
            {filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}{" "}
            to {Math.min(currentPage * pageSize, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </span>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon-xs"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-3.5" />
            </Button>
            <span className="px-2 text-foreground font-medium">
              page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon-xs"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* edit / create modal */}
      <UserEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </Card>
  );
}
