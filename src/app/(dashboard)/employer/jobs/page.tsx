// src/app/(dashboard)/employer/jobs/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  Edit,
  Eye,
  Loader2,
  MapPin,
  Plus,
  Search,
  Send,
  Trash2,
  Users,
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

type EmployerJob = {
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
  status: JobStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
  applications: {
    id: string;
  }[];
  savedJobs?: {
    id: string;
  }[];
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatSalary(job: EmployerJob) {
  if (!job.salaryMin && !job.salaryMax) {
    return "Not disclosed";
  }

  const min = job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : "$0";
  const max = job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : "$0";

  return `${min} - ${max}${job.salaryType ? ` / ${job.salaryType}` : ""}`;
}

function getStatusStyle(status: JobStatus) {
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

function getStatusIcon(status: JobStatus) {
  if (status === "ACTIVE") return CheckCircle2;
  if (status === "PENDING") return Clock;
  if (status === "REJECTED") return XCircle;
  if (status === "CLOSED") return BriefcaseBusiness;
  return BriefcaseBusiness;
}

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [updatingJobId, setUpdatingJobId] = useState("");
  const [deletingJobId, setDeletingJobId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/employer/jobs", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch jobs.");
          return;
        }

        setJobs(data.jobs || []);
      } catch {
        setError("Something went wrong while loading jobs.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(jobs.map((job) => job.category)));

    return ["All Categories", ...uniqueCategories];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(keyword) ||
        job.category.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword) ||
        job.status.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All Status" || job.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All Categories" || job.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [jobs, search, statusFilter, categoryFilter]);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((job) => job.status === "ACTIVE").length;
  const pendingJobs = jobs.filter((job) => job.status === "PENDING").length;
  const closedJobs = jobs.filter((job) => job.status === "CLOSED").length;
  const totalApplications = jobs.reduce(
    (total, job) => total + job.applications.length,
    0
  );

  async function updateJobStatus(jobId: string, status: JobStatus) {
    setError("");
    setSuccess("");
    setUpdatingJobId(jobId);

    try {
      const response = await fetch(`/api/employer/jobs/${jobId}/status`, {
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

      setJobs((currentJobs) =>
        currentJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status,
              }
            : job
        )
      );

      setSuccess(
        status === "CLOSED"
          ? "Job closed successfully."
          : status === "PENDING"
          ? "Job sent for admin review."
          : "Job saved as draft."
      );
    } catch {
      setError("Something went wrong while updating job status.");
    } finally {
      setUpdatingJobId("");
    }
  }

  async function deleteJob(jobId: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job? This action cannot be undone."
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setDeletingJobId(jobId);

    try {
      const response = await fetch(`/api/employer/jobs/${jobId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete job.");
        return;
      }

      setJobs((currentJobs) => currentJobs.filter((job) => job.id !== jobId));
      setSuccess("Job deleted successfully.");
    } catch {
      setError("Something went wrong while deleting job.");
    } finally {
      setDeletingJobId("");
    }
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Employer Jobs
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Manage your job posts
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              View posted jobs, edit details, close open jobs, reopen closed
              jobs for admin review, and delete jobs with no applications.
            </p>
          </div>

          <Link
            href="/employer/jobs/new"
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <Plus className="h-5 w-5" />
            Post New Job
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total Jobs</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {totalJobs}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Active</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {activeJobs}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Pending</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {pendingJobs}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Closed</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {closedJobs}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Applications</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {totalApplications}
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
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_240px]">
          <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
            <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, category, location, or status..."
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            <option>All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Closed</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Loading jobs...
            </p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredJobs.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
            <BriefcaseBusiness className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
            No jobs found
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            No job posts match your current filters.
          </p>

          <Link
            href="/employer/jobs/new"
            className="btn mt-6 border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <Plus className="h-5 w-5" />
            Post New Job
          </Link>
        </div>
      )}

      {/* Jobs */}
      {!loading && !error && filteredJobs.length > 0 && (
        <div className="space-y-5">
          {filteredJobs.map((job) => {
            const StatusIcon = getStatusIcon(job.status);
            const savedCount = job.savedJobs?.length || 0;

            return (
              <article
                key={job.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-6 xl:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                          job.status
                        )}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {job.status}
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
                        <MapPin className="h-4 w-4 text-[#ff7900]" />
                        {job.location}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <BriefcaseBusiness className="h-4 w-4 text-[#ff7900]" />
                        {formatJobType(job.type)}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#ff7900]" />
                        {job.applications.length} applications
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
                          Saved
                        </p>
                        <p className="mt-1 font-extrabold text-[#2c2935]">
                          {savedCount}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Views
                        </p>
                        <p className="mt-1 font-extrabold text-[#2c2935]">
                          {job.views}
                        </p>
                      </div>
                    </div>

                    {job.summary && (
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
                        {job.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 xl:w-[220px]">
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                    >
                      <Eye className="h-5 w-5" />
                      View
                    </Link>

                    <Link
                      href={`/employer/jobs/${job.id}/edit`}
                      className="btn border border-[#ff7900] bg-white text-[#ff7900] hover:bg-[#ff7900] hover:text-white"
                    >
                      <Edit className="h-5 w-5" />
                      Edit
                    </Link>

                    {job.status !== "CLOSED" && (
                      <button
                        type="button"
                        disabled={updatingJobId === job.id}
                        onClick={() => updateJobStatus(job.id, "CLOSED")}
                        className="btn border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                      >
                        {updatingJobId === job.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <XCircle className="h-5 w-5" />
                        )}
                        Close Job
                      </button>
                    )}

                    {job.status === "CLOSED" && (
                      <button
                        type="button"
                        disabled={updatingJobId === job.id}
                        onClick={() => updateJobStatus(job.id, "PENDING")}
                        className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                      >
                        {updatingJobId === job.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                        Reopen Review
                      </button>
                    )}

                    {job.applications.length === 0 ? (
                      <button
                        type="button"
                        disabled={deletingJobId === job.id}
                        onClick={() => deleteJob(job.id)}
                        className="btn border border-red-200 bg-white text-red-600 hover:bg-red-600 hover:text-white"
                      >
                        {deletingJobId === job.id ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                        Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="btn border border-slate-200 bg-slate-100 text-slate-400"
                        title="Jobs with applications cannot be deleted. Close the job instead."
                      >
                        <Trash2 className="h-5 w-5" />
                        Delete Locked
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}