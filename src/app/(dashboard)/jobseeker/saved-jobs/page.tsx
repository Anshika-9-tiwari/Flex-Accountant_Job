// src/app/(dashboard)/jobseeker/saved-jobs/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  MapPin,
  Search,
  Trash2,
} from "lucide-react";

type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "INTERNSHIP";

type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

type SavedJob = {
  id: string;
  createdAt: string;
  job: {
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
    skills: string[];
    createdAt: string;
    company: {
      id: string;
      name: string;
      industry: string | null;
      website: string | null;
      location: string | null;
      logoUrl: string | null;
    };
    applications: {
      id: string;
    }[];
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatSalary(savedJob: SavedJob) {
  const { salaryMin, salaryMax, salaryType } = savedJob.job;

  if (!salaryMin && !salaryMax) {
    return "Salary not disclosed";
  }

  const min = salaryMin ? `$${salaryMin.toLocaleString()}` : "$0";
  const max = salaryMax ? `$${salaryMax.toLocaleString()}` : "$0";

  return `${min} - ${max}${salaryType ? ` / ${salaryType}` : ""}`;
}

export default function JobseekerSavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingSlug, setRemovingSlug] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        const response = await fetch("/api/jobseeker/saved-jobs", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch saved jobs.");
          return;
        }

        setSavedJobs(data.savedJobs || []);
      } catch {
        setError("Something went wrong while loading saved jobs.");
      } finally {
        setLoading(false);
      }
    }

    fetchSavedJobs();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(savedJobs.map((savedJob) => savedJob.job.category))
    );

    return ["All Categories", ...uniqueCategories];
  }, [savedJobs]);

  const filteredSavedJobs = useMemo(() => {
    return savedJobs.filter((savedJob) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        savedJob.job.title.toLowerCase().includes(keyword) ||
        savedJob.job.company.name.toLowerCase().includes(keyword) ||
        savedJob.job.category.toLowerCase().includes(keyword) ||
        savedJob.job.location.toLowerCase().includes(keyword);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        savedJob.job.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [savedJobs, search, categoryFilter]);

  async function removeSavedJob(slug: string) {
    setError("");
    setRemovingSlug(slug);

    try {
      const response = await fetch(`/api/jobs/${slug}/save`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to remove saved job.");
        return;
      }

      setSavedJobs((currentJobs) =>
        currentJobs.filter((savedJob) => savedJob.job.slug !== slug)
      );
    } catch {
      setError("Something went wrong while removing saved job.");
    } finally {
      setRemovingSlug("");
    }
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Saved Jobs
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Your saved accounting jobs
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Keep track of jobs you are interested in and apply when ready.
            </p>
          </div>

          <Link
            href="/jobs"
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <BriefcaseBusiness className="h-5 w-5" />
            Browse Jobs
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Saved Jobs</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {savedJobs.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Applied From Saved</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {savedJobs.filter((savedJob) => savedJob.job.applications.length > 0).length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Categories</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {categories.length - 1}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
            <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by job title, company, category, or location..."
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>

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
              Loading saved jobs...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredSavedJobs.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
            <Bookmark className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
            No saved jobs found
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Save jobs from the job detail page and they will appear here.
          </p>

          <Link
            href="/jobs"
            className="btn mt-6 border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            Browse Jobs
          </Link>
        </div>
      )}

      {/* Saved Job Cards */}
      {!loading && !error && filteredSavedJobs.length > 0 && (
        <div className="space-y-5">
          {filteredSavedJobs.map((savedJob) => (
            <article
              key={savedJob.id}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-6 xl:flex-row">
                <div className="min-w-0 flex-1">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#ff7900]/10 px-3 py-1 text-xs font-bold text-[#ff7900]">
                      {savedJob.job.category}
                    </span>

                    <span className="rounded-full bg-[#0b5f68]/10 px-3 py-1 text-xs font-bold text-[#0b5f68]">
                      {formatWorkMode(savedJob.job.workMode)}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                      {formatJobType(savedJob.job.type)}
                    </span>

                    {savedJob.job.applications.length > 0 && (
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        Applied
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-extrabold text-[#2c2935]">
                    {savedJob.job.title}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#ff7900]" />
                      {savedJob.job.company.name}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#ff7900]" />
                      {savedJob.job.location}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-[#ff7900]" />
                      {formatSalary(savedJob)}
                    </span>

                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#ff7900]" />
                      Saved {formatDate(savedJob.createdAt)}
                    </span>
                  </div>

                  {savedJob.job.summary && (
                    <p className="mt-4 line-clamp-2 max-w-4xl text-sm leading-6 text-slate-500">
                      {savedJob.job.summary}
                    </p>
                  )}

                  {savedJob.job.skills.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {savedJob.job.skills.slice(0, 6).map((skill) => (
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

                <div className="flex shrink-0 flex-col gap-3 xl:w-[180px]">
                  <Link
                    href={`/jobs/${savedJob.job.slug}`}
                    className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                  >
                    <Eye className="h-5 w-5" />
                    View Job
                  </Link>

                  <button
                    type="button"
                    disabled={removingSlug === savedJob.job.slug}
                    onClick={() => removeSavedJob(savedJob.job.slug)}
                    className="btn border border-red-200 bg-white text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    {removingSlug === savedJob.job.slug ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Trash2 className="h-5 w-5" />
                    )}
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}