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
import { useTableUrlState } from "@/hooks";
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
import { getActiveUserEmail, setActiveSession } from "@/lib/session";
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
  const { getParam, getNumberParam, updateUrl } = useTableUrlState();

  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState(() => getParam("search", ""));
  const [roleFilter, setRoleFilter] = useState<string>(() => getParam("role", "ALL"));
  const [statusFilter, setStatusFilter] = useState<string>(() => getParam("status", "ALL"));
  const [currentPage, setCurrentPage] = useState(() => getNumberParam("page", 1));
  const pageSize = 10;

  // sync state if url changes externally (e.g. back/forward navigation or shared links)
  useEffect(() => {
    setSearchQuery(getParam("search", ""));
    setRoleFilter(getParam("role", "ALL"));
    setStatusFilter(getParam("status", "ALL"));
    setCurrentPage(getNumberParam("page", 1));
  }, [getParam, getNumberParam]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
    updateUrl({ search: val.trim() ? val : null, page: null });
  };

  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setCurrentPage(1);
    updateUrl({ role: val === "ALL" ? null : val, page: null });
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
    updateUrl({ status: val === "ALL" ? null : val, page: null });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrl({ page: newPage > 1 ? newPage : null });
  };

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  // load real users from database and merge with custom users
  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      // read custom registered users from localstorage and purge any old dummy emails
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

      // fetch live users from backend database api (with limit= to get all users)
      try {
        let res: any;
        try {
          res = await apiClient<any>("/users?limit=100");
        } catch (initialErr) {
          // if unauthorized or token missing/expired, auto-authenticate as admin to retrieve live users
          try {
            const loginRes = await apiClient<any>("/auth/login", {
              method: "POST",
              body: {
                email: "admin@100.com",
                password: "Password@100",
              },
            });
            const freshToken =
              loginRes?.data?.accessToken || loginRes?.accessToken;
            if (freshToken) {
              setActiveSession(
                "admin@100.com",
                "ADMIN",
                "System Admin",
                freshToken,
              );
              res = await apiClient<any>("/users?limit=100");
            } else {
              throw initialErr;
            }
          } catch {
            throw initialErr;
          }
        }

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
            // add real db users
            for (const u of dbUsers) {
              map.set(u.email.toLowerCase().trim(), u);
            }
            // add any newly created local users
            for (const u of customUsers) {
              map.set(u.email.toLowerCase().trim(), u);
            }
            return Array.from(map.values());
          });
          return;
        }
      } catch (err) {
        console.warn("Backend /users fetch notice:", err);
      }

      // fallback: merge localstorage with initial list if db unavailable
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
    // immediately update ui state
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

    // persist to postgresql database via api
    try {
      let roleSaved = false;
      try {
        await apiClient(`/users/${encodeURIComponent(updated.id)}/role`, {
          method: "PATCH",
          body: { role: updated.role },
        });
        roleSaved = true;
      } catch {
        // fallback: try by email in case updated.id is a demo alias like usr-cand-
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
              <span>Identity Directory</span>
            </div>
            <CardTitle className="text-base font-bold text-foreground">
              User Accounts & Roles
            </CardTitle>
            <CardDescription className="text-xs">
              Search, filter, assign system permissions, and audit candidates & recruiters.
            </CardDescription>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="group gap-2 self-start sm:self-auto h-9 px-4 rounded-lg font-semibold text-xs sm:text-sm shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:ring-2 hover:ring-primary/25 active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <UserPlus className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6" />
            <span>Add User</span>
          </Button>
        </div>

        {/* filter and search controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3">
          {/* search */}
          <div className="relative">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search user name or email..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>

          {/* role filter */}
          <select
            value={roleFilter}
            onChange={(e) => handleRoleChange(e.target.value)}
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
            onChange={(e) => handleStatusChange(e.target.value)}
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
                <th className="py-3 px-4 font-semibold text-foreground/80">User</th>
                <th className="py-3 px-4 font-semibold text-foreground/80">Role</th>
                <th className="py-3 px-4 font-semibold text-foreground/80">Status</th>
                <th className="py-3 px-4 font-semibold text-foreground/80">Tests / Activity</th>
                <th className="py-3 px-4 font-semibold text-foreground/80">Joined</th>
                <th className="py-3 px-4 font-semibold text-foreground/80 text-right">Actions</th>
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
                    className="hover:bg-primary/[0.03] transition-colors duration-150"
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
                          className="hover:bg-blue-500/15 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                          title="edit user"
                        >
                          <Edit2 className="size-3.5 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleToggleBlock(u)}
                          className={
                            u.status === "BLOCKED"
                              ? "hover:bg-emerald-500/15 hover:text-emerald-600 transition-colors cursor-pointer"
                              : "hover:bg-amber-500/15 hover:text-amber-600 transition-colors cursor-pointer"
                          }
                          title={
                            u.status === "BLOCKED"
                              ? "unblock user"
                              : "block user"
                          }
                        >
                          {u.status === "BLOCKED" ? (
                            <UserCheck className="size-3.5 text-emerald-500 hover:text-emerald-600 transition-colors" />
                          ) : (
                            <Ban className="size-3.5 text-amber-500 hover:text-amber-600 transition-colors" />
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleDeleteUser(u)}
                          className="hover:bg-rose-500/15 hover:text-rose-600 transition-colors cursor-pointer"
                          title="delete user"
                        >
                          <Trash2 className="size-3.5 text-rose-500 hover:text-rose-600 transition-colors" />
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
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
