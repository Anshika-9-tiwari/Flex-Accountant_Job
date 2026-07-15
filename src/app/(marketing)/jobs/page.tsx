// src/app/(marketing)/jobs/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  MapPin,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import MarketingHeader from "@/Components/Layouts/MarketingHeader";
import Footer from "@/Components/Layouts/Footer";

type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "INTERNSHIP";

type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

type PublicJob = {
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

function formatSalary(job: PublicJob) {
  if (!job.salaryMin && !job.salaryMax) {
    return "Salary not disclosed";
  }

  const min = job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : "$0";
  const max = job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : "$0";

  return `${min} - ${max} ${job.salaryType ? `/ ${job.salaryType}` : ""}`;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [workMode, setWorkMode] = useState("All Locations");
  const [jobType, setJobType] = useState("All Types");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await fetch("/api/jobs", {
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
    const uniqueCategories = Array.from(
      new Set(jobs.map((job) => job.category))
    );

    return ["All Categories", ...uniqueCategories];
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchValue = keyword.toLowerCase();

      const matchesKeyword =
        job.title.toLowerCase().includes(searchValue) ||
        job.company.name.toLowerCase().includes(searchValue) ||
        job.category.toLowerCase().includes(searchValue) ||
        job.location.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All Categories" || job.category === category;

      const matchesWorkMode =
        workMode === "All Locations" || formatWorkMode(job.workMode) === workMode;

      const matchesJobType =
        jobType === "All Types" || formatJobType(job.type) === jobType;

      return matchesKeyword && matchesCategory && matchesWorkMode && matchesJobType;
    });
  }, [jobs, keyword, category, workMode, jobType]);

  return (
    <main className="bg-[#f5f7fb]">
      <MarketingHeader/>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0b5f68] to-[#083f46] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 inline-flex rounded-full bg-white/10 px-6 py-2 text-sm font-semibold">
            Accounting Jobs
          </p>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">
            Find remote, hybrid, and accounting jobs
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
            Search accounting, bookkeeping, tax, payroll, audit, and finance
            roles posted by employers on Flex-Accountant.
          </p>

          <div className="mt-8 grid gap-4 rounded-2xl bg-white p-4 shadow-lg lg:grid-cols-[1fr_240px_220px_160px]">
            <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
              <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
              <input
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Search job title, company, category..."
                className="w-full bg-transparent py-3 text-[#2c2935] outline-none"
              />
            </div>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="select select-bordered h-13 w-full rounded-xl bg-white text-[#2c2935]"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={workMode}
              onChange={(event) => setWorkMode(event.target.value)}
              className="select select-bordered h-13 w-full rounded-xl bg-white text-[#2c2935]"
            >
              <option>All Locations</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>

            <button
              type="button"
              className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Filters */}
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <SlidersHorizontal className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-extrabold text-[#2c2935]">Filters</h2>
                <p className="text-sm text-slate-500">Refine job results</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-[#2c2935]">
                  Job Type
                </label>

                <select
                  value={jobType}
                  onChange={(event) => setJobType(event.target.value)}
                  className="select select-bordered h-12 w-full rounded-xl bg-white"
                >
                  <option>All Types</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                  <option>Freelance</option>
                  <option>Internship</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#2c2935]">
                  Work Mode
                </label>

                <select
                  value={workMode}
                  onChange={(event) => setWorkMode(event.target.value)}
                  className="select select-bordered h-12 w-full rounded-xl bg-white"
                >
                  <option>All Locations</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#2c2935]">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="select select-bordered h-12 w-full rounded-xl bg-white"
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setKeyword("");
                  setCategory("All Categories");
                  setWorkMode("All Locations");
                  setJobType("All Types");
                }}
                className="btn w-full border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Jobs */}
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Available Jobs
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Showing {filteredJobs.length} approved job
                  {filteredJobs.length === 1 ? "" : "s"}
                </p>
              </div>

              <select className="select select-bordered h-12 rounded-xl bg-white">
                <option>Recently Posted</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>
            </div>

            {loading && (
              <div className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
                  <p className="mt-3 text-sm font-semibold text-slate-500">
                    Loading approved jobs...
                  </p>
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {!loading && !error && filteredJobs.length === 0 && (
              <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
                  <BriefcaseBusiness className="h-8 w-8" />
                </div>

                <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
                  No jobs found
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  No approved jobs match your current filters. Try changing the
                  keyword, category, or work mode.
                </p>
              </div>
            )}

            {!loading && !error && filteredJobs.length > 0 && (
              <div className="space-y-5">
                {filteredJobs.map((job) => (
                  <article
                    key={job.id}
                    className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="flex flex-col justify-between gap-6 xl:flex-row">
                      <div className="min-w-0 flex-1">
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#ff7900]/10 px-3 py-1 text-xs font-bold text-[#ff7900]">
                            {job.category}
                          </span>

                          <span className="rounded-full bg-[#0b5f68]/10 px-3 py-1 text-xs font-bold text-[#0b5f68]">
                            {formatWorkMode(job.workMode)}
                          </span>

                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                            {formatJobType(job.type)}
                          </span>
                        </div>

                        <h3 className="text-2xl font-extrabold text-[#2c2935]">
                          {job.title}
                        </h3>

                        <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
                          <span className="inline-flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-[#ff7900]" />
                            {job.company.name}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#ff7900]" />
                            {job.location}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-[#ff7900]" />
                            {formatSalary(job)}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#ff7900]" />
                            {formatDate(job.createdAt)}
                          </span>
                        </div>

                        {job.summary && (
                          <p className="mt-4 line-clamp-2 max-w-4xl text-sm leading-6 text-slate-500">
                            {job.summary}
                          </p>
                        )}

                        {job.skills.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {job.skills.slice(0, 6).map((skill) => (
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

                      <div className="flex shrink-0 flex-col gap-3 xl:w-[170px]">
                        <Link
                          href={`/jobs/${job.slug}`}
                          className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                        >
                          <Eye className="h-5 w-5" />
                          View Job
                        </Link>

                        <Link
                          href={`/jobs/${job.slug}`}
                          className="btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer/>
    </main>
  );
}