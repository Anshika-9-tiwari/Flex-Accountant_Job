// src/app/(dashboard)/employer/dashboard/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock,
  Eye,
  FilePlus2,
  Loader2,
  MapPin,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  XCircle,
} from "lucide-react";

type JobStatus = "DRAFT" | "PENDING" | "ACTIVE" | "CLOSED" | "REJECTED";

type ApplicationStatus =
  | "APPLIED"
  | "REVIEWED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "REJECTED"
  | "HIRED";

type DashboardJob = {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string;
  status: JobStatus;
  views: number;
  createdAt: string;
  applications: {
    id: string;
  }[];
};

type DashboardApplicant = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
    jobseekerProfile: {
      headline: string | null;
      location: string | null;
      experience: string | null;
      skills: string[];
      resumeUrl: string | null;
      bio: string | null;
    } | null;
  };
  job: {
    id: string;
    title: string;
    slug: string;
    category: string;
  };
};

type DashboardData = {
  employerProfile: {
    id: string;
    designation: string | null;
    isVerified: boolean;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string | null;
    };
  } | null;
  company: {
    id: string;
    name: string;
    industry: string | null;
    size: string | null;
    website: string | null;
    location: string | null;
    logoUrl: string | null;
    description: string | null;
  } | null;
  stats: {
    totalJobs: number;
    activeJobs: number;
    pendingJobs: number;
    rejectedJobs: number;
    closedJobs: number;
    totalApplicants: number;
    reviewedApplicants: number;
    shortlistedApplicants: number;
    interviewApplicants: number;
  };
  recentJobs: DashboardJob[];
  recentApplicants: DashboardApplicant[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getStatusStyle(status: JobStatus | ApplicationStatus) {
  if (status === "ACTIVE" || status === "HIRED") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (status === "PENDING" || status === "INTERVIEW") {
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

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function EmployerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/employer/dashboard", {
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to fetch dashboard.");
          return;
        }

        setData(result);
      } catch {
        setError("Something went wrong while loading dashboard.");
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
            Loading employer dashboard...
          </p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
        {error || "Dashboard data not found."}
      </section>
    );
  }

  const company = data.company;
  const employerProfile = data.employerProfile;
  const stats = data.stats;

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Employer Dashboard
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Welcome back, {employerProfile?.user.name || "Employer"}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Track job posts, applicants, approval status, and hiring activity
              from one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/employer/jobs/new"
              className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
            >
              <FilePlus2 className="h-5 w-5" />
              Post New Job
            </Link>

            <Link
              href="/employer/company"
              className="btn border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0b5f68]"
            >
              <Building2 className="h-5 w-5" />
              Company Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Active Jobs
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.activeJobs}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Pending Jobs
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.pendingJobs}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">
                Applicants
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.totalApplicants}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
              <Users className="h-6 w-6" />
            </div>
          </div>
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
                  Latest job posts from your company.
                </p>
              </div>

              <Link
                href="/employer/jobs"
                className="btn btn-sm border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
              >
                View All
              </Link>
            </div>

            {data.recentJobs.length === 0 ? (
              <div className="rounded-2xl bg-[#f5f7fb] p-8 text-center">
                <BriefcaseBusiness className="mx-auto h-10 w-10 text-[#ff7900]" />
                <h3 className="mt-4 text-xl font-extrabold text-[#2c2935]">
                  No jobs posted yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Create your first job post to start receiving applicants.
                </p>

                <Link
                  href="/employer/jobs/new"
                  className="btn mt-5 border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                >
                  Post New Job
                </Link>
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
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
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

                        <div className="mt-2 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#ff7900]" />
                            {job.location}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#ff7900]" />
                            {job.applications.length} applicants
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <Eye className="h-4 w-4 text-[#ff7900]" />
                            {job.views} views
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/employer/jobs"
                        className="btn btn-sm border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                      >
                        Manage
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Recent Applicants */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Recent Applicants
                </h2>
                <p className="text-sm text-slate-500">
                  Latest candidates who applied to your jobs.
                </p>
              </div>

              <Link
                href="/employer/applicants"
                className="btn btn-sm border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
              >
                View All
              </Link>
            </div>

            {data.recentApplicants.length === 0 ? (
              <div className="rounded-2xl bg-[#f5f7fb] p-8 text-center">
                <Users className="mx-auto h-10 w-10 text-[#ff7900]" />
                <h3 className="mt-4 text-xl font-extrabold text-[#2c2935]">
                  No applicants yet
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Applicants will appear here after jobseekers apply to your
                  jobs.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentApplicants.map((application) => (
                  <article
                    key={application.id}
                    className="rounded-2xl border border-base-300 p-5"
                  >
                    <div className="flex items-start gap-4">
                      {application.user.image ? (
                        <img
                          src={application.user.image}
                          alt={application.user.name}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0b5f68] font-extrabold text-white">
                          {getInitials(application.user.name)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                          <div>
                            <h3 className="font-extrabold text-[#2c2935]">
                              {application.user.name}
                            </h3>

                            <p className="mt-1 text-sm font-semibold text-slate-500">
                              Applied for {application.job.title}
                            </p>
                          </div>

                          <span
                            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                              application.status
                            )}`}
                          >
                            {application.status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          {application.user.jobseekerProfile?.headline ||
                            "Accounting Candidate"}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Company Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              {company?.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0b5f68] text-xl font-extrabold text-white">
                  {company?.name ? getInitials(company.name) : "CO"}
                </div>
              )}

              <div>
                <h2 className="text-xl font-extrabold text-[#2c2935]">
                  {company?.name || "Company not added"}
                </h2>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {company?.industry || "Industry not added"}
                </p>
              </div>
            </div>

            <div className="mt-5">
              {employerProfile?.isVerified ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                  <ShieldCheck className="h-4 w-4" />
                  Verified Employer
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700">
                  <Clock className="h-4 w-4" />
                  Pending Verification
                </span>
              )}
            </div>

            <div className="mt-5 space-y-3 text-sm font-semibold text-slate-500">
              <p>{company?.location || "Location not added"}</p>
              <p>{company?.size || "Company size not added"}</p>
              <p>{company?.website || "Website not added"}</p>
            </div>

            <Link
              href="/employer/company"
              className="btn mt-5 w-full border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
            >
              Update Company
            </Link>
          </div>

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

          {/* Quick Actions */}
          <div className="rounded-2xl bg-[#0b5f68] p-6 text-white shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <TrendingUp className="h-7 w-7 text-[#ff7900]" />
            </div>

            <h2 className="mt-5 text-xl font-extrabold">Quick Actions</h2>

            <div className="mt-5 grid gap-3">
              <Link
                href="/employer/jobs/new"
                className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
              >
                Post New Job
              </Link>

              <Link
                href="/employer/applicants"
                className="btn border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0b5f68]"
              >
                View Applicants
              </Link>

              <Link
                href="/employer/jobseekers"
                className="btn border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0b5f68]"
              >
                Search Candidates
              </Link>
            </div>
          </div>
        </aside>
      </section>
    </section>
  );
}