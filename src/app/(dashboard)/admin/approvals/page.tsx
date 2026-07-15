// src/app/(dashboard)/admin/approvals/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";

type JobStatus = "DRAFT" | "PENDING" | "ACTIVE" | "CLOSED" | "REJECTED";

type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "INTERNSHIP";

type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

type PendingJob = {
  id: string;
  title: string;
  slug: string;
  category: string;
  type: JobType;
  workMode: WorkMode;
  location: string;
  experience: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryType: string | null;
  summary: string | null;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  skills: string[];
  applyMethod: string | null;
  externalApply: string | null;
  deadline: string | null;
  status: JobStatus;
  views: number;
  createdAt: string;
  company: {
    id: string;
    name: string;
    industry: string | null;
    size: string | null;
    website: string | null;
    location: string | null;
    logoUrl: string | null;
    description: string | null;
  };
  applications: {
    id: string;
  }[];
  savedJobs: {
    id: string;
  }[];
};

type PendingEmployer = {
  id: string;
  designation: string | null;
  isVerified: boolean;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
    isActive: boolean;
    createdAt: string;
  };
  company: {
    id: string;
    name: string;
    industry: string | null;
    size: string | null;
    website: string | null;
    location: string | null;
    logoUrl: string | null;
    description: string | null;
    jobs: {
      id: string;
      status: JobStatus;
    }[];
  } | null;
};

type ApprovalsData = {
  pendingJobs: PendingJob[];
  pendingEmployers: PendingEmployer[];
  stats: {
    pendingJobs: number;
    pendingEmployers: number;
    totalPendingApprovals: number;
  };
};

function formatJobType(type: JobType) {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatWorkMode(workMode: WorkMode) {
  if (workMode === "ONSITE") return "On-site";

  return workMode
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) return "Not set";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatSalary(job: PendingJob) {
  if (!job.salaryMin && !job.salaryMax) {
    return "Salary not disclosed";
  }

  const min = job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : "$0";
  const max = job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : "$0";

  return `${min} - ${max}${job.salaryType ? ` / ${job.salaryType}` : ""}`;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AdminApprovalsPage() {
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
  const [pendingEmployers, setPendingEmployers] = useState<PendingEmployer[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [updatingJobId, setUpdatingJobId] = useState("");
  const [updatingEmployerId, setUpdatingEmployerId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeTab, setActiveTab] = useState<"jobs" | "employers">("jobs");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchApprovals() {
      try {
        const response = await fetch("/api/admin/approvals", {
          credentials: "include",
          cache: "no-store",
        });

        const data: ApprovalsData & { message?: string } =
          await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch approvals.");
          return;
        }

        setPendingJobs(data.pendingJobs || []);
        setPendingEmployers(data.pendingEmployers || []);
      } catch {
        setError("Something went wrong while loading approvals.");
      } finally {
        setLoading(false);
      }
    }

    fetchApprovals();
  }, []);

  const filteredJobs = useMemo(() => {
    const keyword = search.toLowerCase();

    return pendingJobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(keyword) ||
        job.company.name.toLowerCase().includes(keyword) ||
        job.category.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword)
      );
    });
  }, [pendingJobs, search]);

  const filteredEmployers = useMemo(() => {
    const keyword = search.toLowerCase();

    return pendingEmployers.filter((employer) => {
      const companyName = employer.company?.name || "";
      const industry = employer.company?.industry || "";
      const location = employer.company?.location || "";

      return (
        employer.user.name.toLowerCase().includes(keyword) ||
        employer.user.email.toLowerCase().includes(keyword) ||
        companyName.toLowerCase().includes(keyword) ||
        industry.toLowerCase().includes(keyword) ||
        location.toLowerCase().includes(keyword)
      );
    });
  }, [pendingEmployers, search]);

  async function updateJobStatus(jobId: string, status: JobStatus) {
    setError("");
    setSuccess("");
    setUpdatingJobId(jobId);

    try {
      const response = await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update job status.");
        return;
      }

      setPendingJobs((currentJobs) =>
        currentJobs.filter((job) => job.id !== jobId)
      );

      setSuccess(
        status === "ACTIVE"
          ? "Job approved successfully."
          : "Job rejected successfully."
      );
    } catch {
      setError("Something went wrong while updating job status.");
    } finally {
      setUpdatingJobId("");
    }
  }

  async function verifyEmployer(employerId: string) {
    setError("");
    setSuccess("");
    setUpdatingEmployerId(employerId);

    try {
      const response = await fetch(`/api/admin/employers/${employerId}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          isVerified: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to verify employer.");
        return;
      }

      setPendingEmployers((currentEmployers) =>
        currentEmployers.filter((employer) => employer.id !== employerId)
      );

      setSuccess("Employer verified successfully.");
    } catch {
      setError("Something went wrong while verifying employer.");
    } finally {
      setUpdatingEmployerId("");
    }
  }

  const totalPending = pendingJobs.length + pendingEmployers.length;

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Admin Approvals
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Review pending approvals
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Approve or reject employer job posts and verify employer company
              profiles.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/jobs"
              className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
            >
              <BriefcaseBusiness className="h-5 w-5" />
              Manage Jobs
            </Link>

            <Link
              href="/admin/employers"
              className="btn border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0b5f68]"
            >
              <Building2 className="h-5 w-5" />
              Employers
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total Pending
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {totalPending}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Pending Jobs</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {pendingJobs.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Pending Employers
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {pendingEmployers.length}
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

      {/* Tabs + Search */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setActiveTab("jobs")}
              className={
                activeTab === "jobs"
                  ? "btn border-none bg-[#0b5f68] text-white hover:bg-[#084a51]"
                  : "btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
              }
            >
              <BriefcaseBusiness className="h-5 w-5" />
              Pending Jobs ({pendingJobs.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("employers")}
              className={
                activeTab === "employers"
                  ? "btn border-none bg-[#0b5f68] text-white hover:bg-[#084a51]"
                  : "btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
              }
            >
              <Building2 className="h-5 w-5" />
              Pending Employers ({pendingEmployers.length})
            </button>
          </div>

          <div className="flex min-w-0 items-center rounded-xl border border-base-300 bg-white px-4 xl:w-[420px]">
            <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                activeTab === "jobs"
                  ? "Search jobs, companies, categories..."
                  : "Search employers, companies, industries..."
              }
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Loading approvals...
            </p>
          </div>
        </div>
      )}

      {/* Pending Jobs */}
      {!loading && activeTab === "jobs" && (
        <div className="space-y-5">
          {filteredJobs.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
                <BriefcaseBusiness className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
                No pending jobs
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Pending job posts will appear here when employers submit jobs
                for approval.
              </p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-6 xl:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                        <Clock className="h-4 w-4" />
                        PENDING REVIEW
                      </span>

                      <span className="rounded-full bg-[#ff7900]/10 px-3 py-1 text-xs font-bold text-[#ff7900]">
                        {job.category}
                      </span>

                      <span className="rounded-full bg-[#0b5f68]/10 px-3 py-1 text-xs font-bold text-[#0b5f68]">
                        {formatWorkMode(job.workMode)}
                      </span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-[#2c2935]">
                      {job.title}
                    </h2>

                    <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-500 md:grid-cols-2 xl:grid-cols-4">
                      <span className="inline-flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#ff7900]" />
                        {job.company.name}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#ff7900]" />
                        {job.location}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <BriefcaseBusiness className="h-4 w-4 text-[#ff7900]" />
                        {formatJobType(job.type)}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#ff7900]" />
                        Posted {formatDate(job.createdAt)}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-4 rounded-2xl bg-[#f5f7fb] p-4 sm:grid-cols-4">
                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Salary
                        </p>
                        <p className="mt-1 font-extrabold text-[#2c2935]">
                          {formatSalary(job)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Experience
                        </p>
                        <p className="mt-1 font-extrabold text-[#2c2935]">
                          {job.experience || "Not added"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Deadline
                        </p>
                        <p className="mt-1 font-extrabold text-[#2c2935]">
                          {formatDate(job.deadline)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Saved
                        </p>
                        <p className="mt-1 font-extrabold text-[#2c2935]">
                          {job.savedJobs.length}
                        </p>
                      </div>
                    </div>

                    {job.summary && (
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
                        {job.summary}
                      </p>
                    )}

                    {job.skills.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {job.skills.slice(0, 8).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-[#f5f7fb] px-3 py-1 text-xs font-bold text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 xl:w-[220px]">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                    >
                      <Eye className="h-5 w-5" />
                      Preview Job
                    </Link>

                    <button
                      type="button"
                      disabled={updatingJobId === job.id}
                      onClick={() => updateJobStatus(job.id, "ACTIVE")}
                      className="btn border-none bg-green-600 text-white hover:bg-green-700"
                    >
                      {updatingJobId === job.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                      Approve
                    </button>

                    <button
                      type="button"
                      disabled={updatingJobId === job.id}
                      onClick={() => updateJobStatus(job.id, "REJECTED")}
                      className="btn border border-red-200 bg-white text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      {updatingJobId === job.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {/* Pending Employers */}
      {!loading && activeTab === "employers" && (
        <div className="space-y-5">
          {filteredEmployers.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
                <Building2 className="h-8 w-8" />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
                No pending employer verifications
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Employer profiles waiting for verification will appear here.
              </p>
            </div>
          ) : (
            filteredEmployers.map((employer) => {
              const company = employer.company;
              const jobs = company?.jobs || [];
              const activeJobs = jobs.filter(
                (job) => job.status === "ACTIVE"
              ).length;
              const pendingJobsCount = jobs.filter(
                (job) => job.status === "PENDING"
              ).length;

              return (
                <article
                  key={employer.id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex flex-col justify-between gap-6 xl:flex-row">
                    <div className="min-w-0 flex-1">
                      <div className="mb-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                          <Clock className="h-4 w-4" />
                          PENDING VERIFICATION
                        </span>

                        {employer.user.isActive ? (
                          <span className="rounded-full bg-[#0b5f68]/10 px-3 py-1 text-xs font-bold text-[#0b5f68]">
                            Active Account
                          </span>
                        ) : (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                            Inactive Account
                          </span>
                        )}
                      </div>

                      <div className="flex items-start gap-4">
                        {company?.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={company.name}
                            className="h-16 w-16 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0b5f68] text-xl font-extrabold text-white">
                            {company?.name
                              ? getInitials(company.name)
                              : getInitials(employer.user.name)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h2 className="text-2xl font-extrabold text-[#2c2935]">
                            {company?.name || "Company not added"}
                          </h2>

                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            {company?.industry || "Industry not added"}
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            Contact: {employer.user.name}
                            {employer.designation
                              ? ` • ${employer.designation}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-500 md:grid-cols-2 xl:grid-cols-4">
                        <a
                          href={`mailto:${employer.user.email}`}
                          className="inline-flex items-center gap-2 text-[#0b5f68] hover:text-[#ff7900]"
                        >
                          <Mail className="h-4 w-4" />
                          {employer.user.email}
                        </a>

                        {employer.user.phone && (
                          <a
                            href={`tel:${employer.user.phone}`}
                            className="inline-flex items-center gap-2 text-[#0b5f68] hover:text-[#ff7900]"
                          >
                            <Phone className="h-4 w-4" />
                            {employer.user.phone}
                          </a>
                        )}

                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#ff7900]" />
                          {company?.location || "Location not added"}
                        </span>

                        {company?.website ? (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-[#0b5f68] hover:text-[#ff7900]"
                          >
                            <Globe className="h-4 w-4" />
                            Website
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <Globe className="h-4 w-4 text-[#ff7900]" />
                            Website not added
                          </span>
                        )}
                      </div>

                      <div className="mt-5 grid gap-4 rounded-2xl bg-[#f5f7fb] p-4 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-bold uppercase text-slate-400">
                            Total Jobs
                          </p>
                          <p className="mt-1 text-lg font-extrabold text-[#2c2935]">
                            {jobs.length}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase text-slate-400">
                            Active Jobs
                          </p>
                          <p className="mt-1 text-lg font-extrabold text-[#2c2935]">
                            {activeJobs}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase text-slate-400">
                            Pending Jobs
                          </p>
                          <p className="mt-1 text-lg font-extrabold text-[#2c2935]">
                            {pendingJobsCount}
                          </p>
                        </div>
                      </div>

                      {company?.description && (
                        <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
                          {company.description}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-col gap-3 xl:w-[220px]">
                      <Link
                        href="/admin/employers"
                        className="btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                      >
                        <Building2 className="h-5 w-5" />
                        View Employers
                      </Link>

                      <Link
                        href="/admin/users"
                        className="btn border border-[#ff7900] bg-white text-[#ff7900] hover:bg-[#ff7900] hover:text-white"
                      >
                        <User className="h-5 w-5" />
                        View User
                      </Link>

                      <button
                        type="button"
                        disabled={updatingEmployerId === employer.id}
                        onClick={() => verifyEmployer(employer.id)}
                        className="btn border-none bg-green-600 text-white hover:bg-green-700"
                      >
                        {updatingEmployerId === employer.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <ShieldCheck className="h-5 w-5" />
                        )}
                        Verify Employer
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}