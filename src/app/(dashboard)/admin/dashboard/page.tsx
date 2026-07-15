// src/app/(dashboard)/admin/dashboard/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Loader2,
  ShieldCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

type UserRole = "JOBSEEKER" | "EMPLOYER" | "ADMIN";
type JobStatus = "DRAFT" | "PENDING" | "ACTIVE" | "CLOSED" | "REJECTED";
type ApplicationStatus =
  | "APPLIED"
  | "REVIEWED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "REJECTED"
  | "HIRED";

type AdminDashboardData = {
  stats: {
    totalUsers: number;
    jobseekers: number;
    employers: number;
    admins: number;
    totalCompanies: number;
    totalJobs: number;
    activeJobs: number;
    pendingJobs: number;
    rejectedJobs: number;
    closedJobs: number;
    totalApplications: number;
    pendingEmployerVerifications: number;
  };

  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
  }[];

  recentJobs: {
    id: string;
    title: string;
    slug: string;
    category: string;
    location: string;
    status: JobStatus;
    createdAt: string;
    company: {
      id: string;
      name: string;
    };
    applications: {
      id: string;
    }[];
  }[];

  recentApplications: {
    id: string;
    status: ApplicationStatus;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    job: {
      id: string;
      title: string;
      slug: string;
      company: {
        id: string;
        name: string;
      };
    };
  }[];

  pendingEmployers: {
    id: string;
    designation: string | null;
    isVerified: boolean;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    company: {
      id: string;
      name: string;
      industry: string | null;
      location: string | null;
      website: string | null;
    } | null;
  }[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getJobStatusStyle(status: JobStatus) {
  if (status === "ACTIVE") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (status === "PENDING") {
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }

  if (status === "REJECTED") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (status === "CLOSED") {
    return "bg-slate-100 text-slate-600 border-slate-200";
  }

  return "bg-blue-50 text-blue-700 border-blue-200";
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

function getApplicationStatusStyle(status: ApplicationStatus) {
  if (status === "HIRED") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (status === "INTERVIEW") {
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }

  if (status === "REJECTED") {
    return "bg-red-50 text-red-700 border-red-200";
  }

  if (status === "SHORTLISTED") {
    return "bg-[#ff7900]/10 text-[#ff7900] border-orange-200";
  }

  if (status === "REVIEWED") {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }

  return "bg-blue-50 text-blue-700 border-blue-200";
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/admin/dashboard", {
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to fetch admin dashboard.");
          return;
        }

        setData(result);
      } catch {
        setError("Something went wrong while loading admin dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading admin dashboard...
          </p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
        {error || "Admin dashboard data not found."}
      </section>
    );
  }

  const stats = data.stats;

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Admin Dashboard
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Platform overview
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Monitor users, employers, jobs, applications, and pending platform
              approvals from one dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/approvals"
              className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
            >
              <ShieldCheck className="h-5 w-5" />
              Review Approvals
            </Link>

            <Link
              href="/admin/users"
              className="btn border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0b5f68]"
            >
              <Users className="h-5 w-5" />
              Manage Users
            </Link>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Total Users
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.totalUsers}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Total Jobs
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.totalJobs}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Applications
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.totalApplications}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Pending Approvals
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.pendingJobs + stats.pendingEmployerVerifications}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Jobseekers</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {stats.jobseekers}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Employers</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {stats.employers}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Companies</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {stats.totalCompanies}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Active Jobs</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {stats.activeJobs}
          </h2>
        </div>
      </div>

      <section className="grid gap-8 xl:grid-cols-[1fr_360px]">
        {/* Left */}
        <div className="space-y-8">
          {/* Recent Jobs */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Recent Jobs
                </h2>
                <p className="text-sm text-slate-500">
                  Latest jobs submitted by employers.
                </p>
              </div>

              <Link
                href="/admin/jobs"
                className="btn btn-sm border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
              >
                View All
              </Link>
            </div>

            {data.recentJobs.length === 0 ? (
              <div className="rounded-2xl bg-[#f5f7fb] p-8 text-center">
                <BriefcaseBusiness className="mx-auto h-10 w-10 text-[#ff7900]" />
                <h3 className="mt-4 text-xl font-extrabold text-[#2c2935]">
                  No jobs yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Jobs will appear after employers start posting.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentJobs.map((job) => (
                  <article
                    key={job.id}
                    className="rounded-2xl border border-base-300 p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div>
                        <div className="mb-2 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-bold ${getJobStatusStyle(
                              job.status
                            )}`}
                          >
                            {job.status}
                          </span>

                          <span className="rounded-full bg-[#0b5f68]/10 px-3 py-1 text-xs font-bold text-[#0b5f68]">
                            {job.category}
                          </span>
                        </div>

                        <h3 className="text-lg font-extrabold text-[#2c2935]">
                          {job.title}
                        </h3>

                        <p className="mt-2 text-sm font-semibold text-slate-500">
                          {job.company.name} • {job.location}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {job.applications.length} applications • Posted{" "}
                          {formatDate(job.createdAt)}
                        </p>
                      </div>

                      <Link
                        href={`/jobs/${job.slug}`}
                        className="btn btn-sm border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Recent Applications
                </h2>
                <p className="text-sm text-slate-500">
                  Latest jobseeker applications across the platform.
                </p>
              </div>

              <Link
                href="/admin/applications"
                className="btn btn-sm border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
              >
                View All
              </Link>
            </div>

            {data.recentApplications.length === 0 ? (
              <div className="rounded-2xl bg-[#f5f7fb] p-8 text-center">
                <FileText className="mx-auto h-10 w-10 text-[#ff7900]" />
                <h3 className="mt-4 text-xl font-extrabold text-[#2c2935]">
                  No applications yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Applications will appear after jobseekers apply to jobs.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentApplications.map((application) => (
                  <article
                    key={application.id}
                    className="rounded-2xl border border-base-300 p-5"
                  >
                    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                      <div>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${getApplicationStatusStyle(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>

                        <h3 className="mt-3 text-lg font-extrabold text-[#2c2935]">
                          {application.user.name}
                        </h3>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          Applied for {application.job.title}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {application.job.company.name} •{" "}
                          {formatDate(application.createdAt)}
                        </p>
                      </div>

                      <Link
                        href={`/jobs/${application.job.slug}`}
                        className="btn btn-sm border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                      >
                        <Eye className="h-4 w-4" />
                        Job
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {/* Job Status */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-extrabold text-[#2c2935]">
              Job Status
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Active
                </span>
                <span className="font-extrabold text-[#2c2935]">
                  {stats.activeJobs}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  Pending
                </span>
                <span className="font-extrabold text-[#2c2935]">
                  {stats.pendingJobs}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <XCircle className="h-4 w-4 text-red-600" />
                  Rejected
                </span>
                <span className="font-extrabold text-[#2c2935]">
                  {stats.rejectedJobs}
                </span>
              </div>
            </div>
          </div>

          {/* Pending Employers */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#2c2935]">
                Pending Employers
              </h2>

              <Link
                href="/admin/approvals"
                className="text-sm font-bold text-[#ff7900] hover:underline"
              >
                Review
              </Link>
            </div>

            {data.pendingEmployers.length === 0 ? (
              <p className="text-sm leading-6 text-slate-500">
                No employer profiles are waiting for verification.
              </p>
            ) : (
              <div className="space-y-4">
                {data.pendingEmployers.map((employer) => (
                  <article
                    key={employer.id}
                    className="rounded-2xl bg-[#f5f7fb] p-4"
                  >
                    <h3 className="font-extrabold text-[#2c2935]">
                      {employer.company?.name || "Company not added"}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {employer.user.name}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {formatDate(employer.createdAt)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-[#0b5f68] p-6 text-white shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck className="h-7 w-7 text-[#ff7900]" />
            </div>

            <h2 className="mt-5 text-xl font-extrabold">Admin Actions</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/admin/approvals"
                className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
              >
                Review Approvals
              </Link>

              <Link
                href="/admin/users"
                className="btn border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0b5f68]"
              >
                Manage Users
              </Link>

              <Link
                href="/admin/jobs"
                className="btn border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0b5f68]"
              >
                Manage Jobs
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </section>
  );
}