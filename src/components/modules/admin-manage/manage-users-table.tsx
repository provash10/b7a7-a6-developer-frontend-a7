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
import { useMemo, useState } from "react";
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
import { type ManagedUser, UserEditModal } from "./user-edit-modal";

const INITIAL_USERS: ManagedUser[] = [
  {
    id: "usr-01",
    name: "Provash Kumar",
    email: "provash10@gmail.com",
    role: "CANDIDATE",
    status: "ACTIVE",
    createdAt: "Oct 12, 2026",
    assessmentsCount: 3,
  },
  {
    id: "usr-02",
    name: "Alex Johnson",
    email: "user@devassess.com",
    role: "RECRUITER",
    status: "ACTIVE",
    createdAt: "Sep 20, 2026",
    assessmentsCount: 18,
  },
  {
    id: "usr-03",
    name: "Sarah Jenkins",
    email: "sarah@techcorp.io",
    role: "RECRUITER",
    status: "ACTIVE",
    createdAt: "Aug 15, 2026",
    assessmentsCount: 24,
  },
  {
    id: "usr-04",
    name: "Tariqul Islam",
    email: "tariqul.dev@gmail.com",
    role: "CANDIDATE",
    status: "ACTIVE",
    createdAt: "Oct 18, 2026",
    assessmentsCount: 5,
  },
  {
    id: "usr-05",
    name: "Farhana Akter",
    email: "farhana.ui@yahoo.com",
    role: "CANDIDATE",
    status: "BLOCKED",
    createdAt: "Sep 05, 2026",
    assessmentsCount: 2,
  },
  {
    id: "usr-06",
    name: "Master Admin",
    email: "admin@devassess.io",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "May 01, 2026",
    assessmentsCount: 0,
  },
  {
    id: "usr-07",
    name: "Shahriar Ahmed",
    email: "shahriar.eng@outlook.com",
    role: "CANDIDATE",
    status: "PENDING",
    createdAt: "Oct 21, 2026",
    assessmentsCount: 1,
  },
  {
    id: "usr-08",
    name: "David Miller",
    email: "david@pixelcraft.studio",
    role: "RECRUITER",
    status: "ACTIVE",
    createdAt: "Jul 10, 2026",
    assessmentsCount: 9,
  },
];

export function ManageUsersTable() {
  // console.log("rendering manage users table component");

  const [users, setUsers] = useState<ManagedUser[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  // filter users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // paginated items
  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  // toggle block / active
  const handleToggleBlock = (user: ManagedUser) => {
    const newStatus = user.status === "BLOCKED" ? "ACTIVE" : "BLOCKED";
    // console.log("toggling user status", user.id, newstatus);

    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)),
    );

    toast.add({
      title: newStatus === "BLOCKED" ? "User Blocked" : "User Unblocked",
      description: `${user.name} is now ${newStatus.toLowerCase()}.`,
      type: newStatus === "BLOCKED" ? "destructive" : "success",
    });
  };

  // delete user
  const handleDeleteUser = (user: ManagedUser) => {
    // console.log("deleting user account", user.id);
    setUsers((prev) => prev.filter((u) => u.id !== user.id));

    toast.add({
      title: "User Removed",
      description: `Account for ${user.name} has been deleted.`,
      type: "success",
    });
  };

  // save / create user from modal
  const handleSaveUser = (updated: ManagedUser) => {
    // console.log("saving managed user data", updated.id);
    if (editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      toast.add({
        title: "User Updated",
        description: `Changes to ${updated.name} have been saved.`,
        type: "success",
      });
    } else {
      setUsers((prev) => [updated, ...prev]);
      toast.add({
        title: "User Created",
        description: `New ${updated.role.toLowerCase()} account created for ${updated.name}.`,
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
