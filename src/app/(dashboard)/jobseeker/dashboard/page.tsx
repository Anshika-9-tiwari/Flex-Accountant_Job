"use client";

import ApplyJobButton from "@/Components/Jobs/ApplyJobButton";
import SaveJobButton from "@/Components/Jobs/SaveJobButton";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  Loader2,
  MapPin,
  Search,
  User,
} from "lucide-react";

type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "INTERNSHIP";

type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

type ApplicationStatus =
  | "APPLIED"
  | "REVIEWED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "REJECTED"
  | "HIRED";

type RecommendedJob = {
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
  savedJobs: {
    id: string;
  }[];
};

type RecentApplication = {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  job: {
    id: string;
    title: string;
    slug: string;
    category: string;
    location: string;
    company: {
      id: string;
      name: string;
    };
  };
};

type RecentSavedJob = {
  id: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    slug: string;
    category: string;
    location: string;
    company: {
      id: string;
      name: string;
    };
  };
};

type DashboardData = {
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
  } | null;
  stats: {
    totalApplications: number;
    savedJobs: number;
    reviewedApplications: number;
    interviewApplications: number;
    shortlistedApplications: number;
    hiredApplications: number;
  };
  recentApplications: RecentApplication[];
  recentSavedJobs: RecentSavedJob[];
  recommendedJobs: RecommendedJob[];
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

function formatSalary(job: RecommendedJob) {
  if (!job.salaryMin && !job.salaryMax) {
    return "Salary not disclosed";
  }

  const min = job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : "$0";
  const max = job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : "$0";

  return `${min} - ${max}${job.salaryType ? ` / ${job.salaryType}` : ""}`;
}

function getStatusStyle(status: ApplicationStatus) {
  if (status === "HIRED") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (status === "INTERVIEW") {
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  }

  if (status === "SHORTLISTED") {
    return "bg-[#ff7900]/10 text-[#ff7900] border-orange-200";
  }

  if (status === "REJECTED") {
    return "bg-red-50 text-red-700 border-red-200";
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

export default function JobseekerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [workModeFilter, setWorkModeFilter] = useState("All Locations");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const response = await fetch("/api/jobseeker/dashboard", {
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

  const categories = useMemo(() => {
    const jobs = data?.recommendedJobs || [];
    const uniqueCategories = Array.from(new Set(jobs.map((job) => job.category)));

    return ["All Categories", ...uniqueCategories];
  }, [data]);

  const filteredJobs = useMemo(() => {
    const jobs = data?.recommendedJobs || [];

    return jobs.filter((job) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(keyword) ||
        job.company.name.toLowerCase().includes(keyword) ||
        job.category.toLowerCase().includes(keyword) ||
        job.location.toLowerCase().includes(keyword);

      const matchesCategory =
        categoryFilter === "All Categories" || job.category === categoryFilter;

      const matchesWorkMode =
        workModeFilter === "All Locations" ||
        formatWorkMode(job.workMode) === workModeFilter;

      return matchesSearch && matchesCategory && matchesWorkMode;
    });
  }, [data, search, categoryFilter, workModeFilter]);

  if (loading) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading jobseeker dashboard...
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

  const user = data.user;
  const profile = user?.jobseekerProfile;
  const stats = data.stats;

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-6 py-2 text-sm tracking-wide">
              Jobseeker Dashboard
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Welcome back, {user?.name || "Jobseeker"}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Track applications, saved jobs, and discover new accounting roles
              matching your profile.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
            >
              <BriefcaseBusiness className="h-5 w-5" />
              Find Jobs
            </Link>

            <Link
              href="/jobseeker/profile"
              className="btn border border-white/30 bg-white/10 text-white hover:bg-white hover:text-[#0b5f68]"
            >
              <User className="h-5 w-5" />
              Update Profile
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
                Applications
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.totalApplications}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Saved Jobs</p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.savedJobs}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
              <Bookmark className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Interviews</p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.interviewApplications}
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
              <p className="text-sm font-semibold text-slate-500">Hired</p>
              <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
                {stats.hiredApplications}
              </h2>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-8 xl:grid-cols-[1fr_360px]">
        {/* Main */}
        <div className="space-y-8">
          {/* Filters */}
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[1fr_160px_160px]">
              <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search jobs, companies, categories..."
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

              <select
                value={workModeFilter}
                onChange={(event) => setWorkModeFilter(event.target.value)}
                className="select select-bordered h-13 w-full rounded-xl bg-white"
              >
                <option>All Locations</option>
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </div>
          </div>

          {/* Recommended Jobs */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Recommended Jobs
                </h2>
                <p className="text-sm text-slate-500">
                  Approved jobs currently available on Flex-Accountant.
                </p>
              </div>

              <Link
                href="/jobs"
                className="btn btn-sm border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
              >
                View All Jobs
              </Link>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="rounded-2xl bg-[#f5f7fb] p-8 text-center">
                <BriefcaseBusiness className="mx-auto h-10 w-10 text-[#ff7900]" />

                <h3 className="mt-4 text-xl font-extrabold text-[#2c2935]">
                  No jobs found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  No approved jobs match your current filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {filteredJobs.map((job) => {
                  const alreadyApplied = job.applications.length > 0;

                  return (
                    <article
                      key={job.id}
                      className="rounded-2xl border border-base-300 p-5 transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="mb-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#ff7900]/10 px-3 py-1 text-xs font-bold text-[#ff7900]">
                          {job.category}
                        </span>

                        <span className="rounded-full bg-[#0b5f68]/10 px-3 py-1 text-xs font-bold text-[#0b5f68]">
                          {formatWorkMode(job.workMode)}
                        </span>

                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {formatJobType(job.type)}
                        </span>

                        {alreadyApplied && (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                            Applied
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-extrabold text-[#2c2935]">
                        {job.title}
                      </h3>

                      <p className="mt-2 text-sm font-semibold text-slate-500">
                        {job.company.name}
                      </p>

                      <div className="mt-4 space-y-2 text-sm font-semibold text-slate-500">
                        <p className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#ff7900]" />
                          {job.location}
                        </p>

                        <p className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-[#ff7900]" />
                          {formatDate(job.createdAt)}
                        </p>

                        <p>{formatSalary(job)}</p>
                      </div>

                      {job.summary && (
                        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                          {job.summary}
                        </p>
                      )}

                      <div className="mt-5 grid gap-3">
                        <Link
                          href={`/jobs/${job.slug}`}
                          className="btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                        >
                          <Eye className="h-5 w-5" />
                          View Job
                        </Link>

                        {alreadyApplied ? (
                          <Link
                            href="/jobseeker/applications"
                            className="btn border-none bg-green-700 text-white hover:bg-green-800"
                          >
                            Applied
                          </Link>
                        ) : (
                          <ApplyJobButton
                            slug={job.slug}
                            className="btn w-full border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                          />
                        )}

                        <SaveJobButton slug={job.slug} />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Profile Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-16 w-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b5f68] text-xl font-extrabold text-white">
                {user?.name ? getInitials(user.name) : "JS"}
              </div>
            )}

            <h2 className="mt-5 text-xl font-extrabold text-[#2c2935]">
              {user?.name || "Jobseeker"}
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {profile?.headline || "Accounting Candidate"}
            </p>

            <div className="mt-5 space-y-3 text-sm font-semibold text-slate-500">
              <p>{user?.email}</p>
              <p>{profile?.location || "Location not added"}</p>
              <p>{profile?.experience || "Experience not added"}</p>
            </div>

            <Link
              href="/jobseeker/profile"
              className="btn mt-5 w-full border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
            >
              Update Profile
            </Link>
          </div>

          {/* Recent Applications */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#2c2935]">
                Recent Applications
              </h2>

              <Link
                href="/jobseeker/applications"
                className="text-sm font-bold text-[#ff7900] hover:underline"
              >
                View All
              </Link>
            </div>

            {data.recentApplications.length === 0 ? (
              <p className="text-sm leading-6 text-slate-500">
                You have not applied to any jobs yet.
              </p>
            ) : (
              <div className="space-y-4">
                {data.recentApplications.map((application) => (
                  <article
                    key={application.id}
                    className="rounded-2xl bg-[#f5f7fb] p-4"
                  >
                    <h3 className="font-extrabold text-[#2c2935]">
                      {application.job.title}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {application.job.company.name}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        {application.status}
                      </span>

                      <span className="text-xs font-semibold text-slate-400">
                        {formatDate(application.createdAt)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Recent Saved Jobs */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-[#2c2935]">
                Saved Jobs
              </h2>

              <Link
                href="/jobseeker/saved-jobs"
                className="text-sm font-bold text-[#ff7900] hover:underline"
              >
                View All
              </Link>
            </div>

            {data.recentSavedJobs.length === 0 ? (
              <p className="text-sm leading-6 text-slate-500">
                Saved jobs will appear here.
              </p>
            ) : (
              <div className="space-y-4">
                {data.recentSavedJobs.map((savedJob) => (
                  <article
                    key={savedJob.id}
                    className="rounded-2xl bg-[#f5f7fb] p-4"
                  >
                    <h3 className="font-extrabold text-[#2c2935]">
                      {savedJob.job.title}
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-slate-500">
                      {savedJob.job.company.name}
                    </p>

                    <Link
                      href={`/jobs/${savedJob.job.slug}`}
                      className="mt-3 inline-flex text-sm font-bold text-[#ff7900] hover:underline"
                    >
                      View Job
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>
    </section>
  );
}