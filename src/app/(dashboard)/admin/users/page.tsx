"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Eye,
  Loader2,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  User,
  Users,
  XCircle,
} from "lucide-react";

type UserRole = "JOBSEEKER" | "EMPLOYER" | "ADMIN";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  jobseekerProfile: {
    headline: string | null;
    location: string | null;
    experience: string | null;
    skills: string[];
    resumeUrl: string | null;
    bio: string | null;
  } | null;
  employerProfile: {
    designation: string | null;
    isVerified: boolean;
    company: {
      id: string;
      name: string;
      industry: string | null;
      website: string | null;
      location: string | null;
    } | null;
  } | null;
  applications: {
    id: string;
  }[];
  savedJobs: {
    id: string;
  }[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getRoleStyle(role: UserRole) {
  if (role === "ADMIN") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (role === "EMPLOYER") {
    return "bg-[#ff7900]/10 text-[#ff7900] border-orange-200";
  }

  return "bg-[#0b5f68]/10 text-[#0b5f68] border-teal-200";
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/admin/users", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch users.");
          return;
        }

        setUsers(data.users || []);
      } catch {
        setError("Something went wrong while loading users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();

      const companyName = user.employerProfile?.company?.name || "";
      const headline = user.jobseekerProfile?.headline || "";

      const matchesSearch =
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        companyName.toLowerCase().includes(keyword) ||
        headline.toLowerCase().includes(keyword);

      const matchesRole = roleFilter === "All Roles" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Active" && user.isActive) ||
        (statusFilter === "Inactive" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalUsers = users.length;
  const jobseekers = users.filter((user) => user.role === "JOBSEEKER").length;
  const employers = users.filter((user) => user.role === "EMPLOYER").length;
  const admins = users.filter((user) => user.role === "ADMIN").length;

  async function updateUserStatus(userId: string, isActive: boolean) {
    setError("");
    setSuccess("");
    setUpdatingId(userId);

    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update user status.");
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                isActive,
              }
            : user
        )
      );

      setSuccess(data.message || "User status updated successfully.");
    } catch {
      setError("Something went wrong while updating user status.");
    } finally {
      setUpdatingId("");
    }
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Admin Users
            </p>

            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Manage platform users
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              View jobseekers, employers, and admins. Activate or deactivate
              user accounts from one place.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <ShieldCheck className="h-5 w-5" />
            Admin Dashboard
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Users</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {totalUsers}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Jobseekers</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {jobseekers}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Employers</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {employers}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Admins</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {admins}
          </h2>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_200px_200px]">
          <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
            <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, email, company, or headline..."
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            <option>All Roles</option>
            <option value="JOBSEEKER">Jobseeker</option>
            <option value="EMPLOYER">Employer</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Loading users...
            </p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredUsers.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
            <Users className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
            No users found
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            No platform users match your current filters.
          </p>
        </div>
      )}

      {/* Users */}
      {!loading && !error && filteredUsers.length > 0 && (
        <div className="rounded-2xl bg-white shadow-sm">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="table">
              <thead>
                <tr className="border-base-300 text-sm text-slate-500">
                  <th>User</th>
                  <th>Role</th>
                  <th>Profile</th>
                  <th>Activity</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-base-300">
                    <td>
                      <div className="flex items-center gap-4">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="h-12 w-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68] font-extrabold text-white">
                            {getInitials(user.name)}
                          </div>
                        )}

                        <div>
                          <p className="font-extrabold text-[#2c2935]">
                            {user.name}
                          </p>

                          <p className="text-sm font-semibold text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.role === "EMPLOYER" ? (
                        <div>
                          <p className="font-bold text-[#2c2935]">
                            {user.employerProfile?.company?.name ||
                              "Company not added"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {user.employerProfile?.designation ||
                              "Designation not added"}
                          </p>
                        </div>
                      ) : user.role === "JOBSEEKER" ? (
                        <div>
                          <p className="font-bold text-[#2c2935]">
                            {user.jobseekerProfile?.headline ||
                              "Candidate profile"}
                          </p>
                          <p className="text-sm text-slate-500">
                            {user.jobseekerProfile?.location ||
                              "Location not added"}
                          </p>
                        </div>
                      ) : (
                        <p className="font-bold text-[#2c2935]">Platform Admin</p>
                      )}
                    </td>

                    <td>
                      {user.role === "JOBSEEKER" ? (
                        <p className="text-sm font-semibold text-slate-500">
                          {user.applications.length} applications ·{" "}
                          {user.savedJobs.length} saved
                        </p>
                      ) : user.role === "EMPLOYER" ? (
                        <p className="text-sm font-semibold text-slate-500">
                          {user.employerProfile?.isVerified
                            ? "Verified employer"
                            : "Pending verification"}
                        </p>
                      ) : (
                        <p className="text-sm font-semibold text-slate-500">
                          Admin access
                        </p>
                      )}
                    </td>

                    <td>
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                          <XCircle className="h-4 w-4" />
                          Inactive
                        </span>
                      )}
                    </td>

                    <td>
                      <p className="text-sm font-semibold text-slate-500">
                        {formatDate(user.createdAt)}
                      </p>
                    </td>

                    <td className="text-right">
                      <button
                        type="button"
                        disabled={updatingId === user.id}
                        onClick={() =>
                          updateUserStatus(user.id, !user.isActive)
                        }
                        className={
                          user.isActive
                            ? "btn btn-sm border border-red-200 bg-white text-red-600 hover:bg-red-600 hover:text-white"
                            : "btn btn-sm border-none bg-green-600 text-white hover:bg-green-700"
                        }
                      >
                        {updatingId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : user.isActive ? (
                          "Deactivate"
                        ) : (
                          "Activate"
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="grid gap-5 p-5 lg:hidden">
            {filteredUsers.map((user) => (
              <article
                key={user.id}
                className="rounded-2xl border border-base-300 p-5"
              >
                <div className="flex items-start gap-4">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-14 w-14 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0b5f68] text-lg font-extrabold text-white">
                      {getInitials(user.name)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-extrabold text-[#2c2935]">
                      {user.name}
                    </h2>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {user.email}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getRoleStyle(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>

                      {user.isActive ? (
                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-500">
                  {user.phone && (
                    <p className="inline-flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#ff7900]" />
                      {user.phone}
                    </p>
                  )}

                  <p className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#ff7900]" />
                    {user.email}
                  </p>

                  {user.role === "EMPLOYER" && (
                    <p className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#ff7900]" />
                      {user.employerProfile?.company?.name ||
                        "Company not added"}
                    </p>
                  )}

                  {user.role === "JOBSEEKER" && (
                    <p className="inline-flex items-center gap-2">
                      <BriefcaseBusiness className="h-4 w-4 text-[#ff7900]" />
                      {user.jobseekerProfile?.headline ||
                        "Candidate profile"}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  disabled={updatingId === user.id}
                  onClick={() => updateUserStatus(user.id, !user.isActive)}
                  className={
                    user.isActive
                      ? "btn mt-5 w-full border border-red-200 bg-white text-red-600 hover:bg-red-600 hover:text-white"
                      : "btn mt-5 w-full border-none bg-green-600 text-white hover:bg-green-700"
                  }
                >
                  {updatingId === user.id ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : user.isActive ? (
                    "Deactivate User"
                  ) : (
                    "Activate User"
                  )}
                </button>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}