// src/app/(marketing)/jobs/[slug]/page.tsx

"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  DollarSign,
  ExternalLink,
  Globe,
  Loader2,
  MapPin,
  Send,
  Share2,
} from "lucide-react";
import ApplyJobButton from "@/Components/Jobs/ApplyJobButton";
import MarketingHeader from "@/Components/Layouts/MarketingHeader";
import Footer from "@/Components/Layouts/Footer";
import SaveJobButton from "@/Components/Jobs/SaveJobButton";

type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "INTERNSHIP";

type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

type JobDetail = {
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
  status: string;
  views: number;
  createdAt: string;
  company: {
    id: string;
    name: string;
    industry: string | null;
    website: string | null;
    location: string | null;
    logoUrl: string | null;
    description: string | null;
  };
  applications: {
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

function formatSalary(job: JobDetail) {
  if (!job.salaryMin && !job.salaryMax) {
    return "Salary not disclosed";
  }

  const min = job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : "$0";
  const max = job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : "$0";

  return `${min} - ${max}${job.salaryType ? ` / ${job.salaryType}` : ""}`;
}

function getCompanyInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function JobDetailsPage() {
  const params = useParams();

  const slug = useMemo(() => {
    const rawSlug = params.slug;

    if (Array.isArray(rawSlug)) {
      return rawSlug[0];
    }

    return rawSlug || "";
  }, [params.slug]);

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJob() {
      if (!slug) return;

      try {
        const response = await fetch(`/api/jobs/${slug}`, {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Job not found.");
          return;
        }

        setJob(data.job);
      } catch {
        setError("Something went wrong while loading this job.");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#ff7900]" />
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading job details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] px-4 py-16">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <BriefcaseBusiness className="h-8 w-8" />
          </div>

          <h1 className="mt-6 text-3xl font-extrabold text-[#2c2935]">
            Job not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            {error || "This job may have been removed or is no longer active."}
          </p>

          <Link
            href="/jobs"
            className="btn mt-6 border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Jobs
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#f5f7fb]">
      <MarketingHeader/>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0b5f68] to-[#083f46] px-6 py-12 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/jobs"
            className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white border border-white/20 rounded-full px-4 py-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="mb-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#ff7900] px-5 py-2 text-sm font-bold text-white">
                  {job.category}
                </span>

                <span className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white">
                  {formatWorkMode(job.workMode)}
                </span>

                <span className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white">
                  {formatJobType(job.type)}
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">
                {job.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold text-white/85">
                <span className="inline-flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#ff7900]" />
                  {job.company.name}
                </span>

                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#ff7900]" />
                  {job.location}
                </span>

                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-[#ff7900]" />
                  Posted {formatDate(job.createdAt)}
                </span>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 text-[#2c2935] shadow-lg">
              <p className="text-sm font-semibold text-slate-500">
                Compensation
              </p>

              <h2 className="mt-2 text-xl font-bold">
                {formatSalary(job)}
              </h2>

              <div className="mt-5 grid gap-3">
                <ApplyJobButton
                  slug={job.slug}
                  className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00] w-full"
                /> 

                <SaveJobButton slug={job.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div className="space-y-8">
            {/* Summary */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-extrabold text-[#2c2935]">
                Job Summary
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {job.summary ||
                  "No job summary has been added by the employer yet."}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-extrabold text-[#2c2935]">
                Responsibilities
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {job.responsibilities ||
                  "Responsibilities have not been added by the employer yet."}
              </p>
            </div>

            {/* Requirements */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-extrabold text-[#2c2935]">
                Requirements
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {job.requirements ||
                  "Requirements have not been added by the employer yet."}
              </p>
            </div>

            {/* Benefits */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-extrabold text-[#2c2935]">
                Benefits
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                {job.benefits ||
                  "Benefits have not been added by the employer yet."}
              </p>
            </div>

            {/* Skills */}
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-extrabold text-[#2c2935]">
                Required Skills
              </h2>

              {job.skills.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-[#ff7900]/10 px-4 py-2 text-sm font-bold text-[#ff7900]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No specific skills have been added.
                </p>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Job Overview */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-[#2c2935]">
                Job Overview
              </h2>

              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                    <BriefcaseBusiness className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Job Type
                    </p>
                    <p className="mt-1 font-bold text-[#2c2935]">
                      {formatJobType(job.type)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Work Mode
                    </p>
                    <p className="mt-1 font-bold text-[#2c2935]">
                      {formatWorkMode(job.workMode)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                    <Clock className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Experience
                    </p>
                    <p className="mt-1 font-bold text-[#2c2935]">
                      {job.experience || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                    <DollarSign className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Salary
                    </p>
                    <p className="mt-1 font-bold text-[#2c2935]">
                      {formatSalary(job)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Deadline
                    </p>
                    <p className="mt-1 font-bold text-[#2c2935]">
                      {job.deadline
                        ? formatDate(job.deadline)
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                {job.company.logoUrl ? (
                  <img
                    src={job.company.logoUrl}
                    alt={job.company.name}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b5f68] text-xl font-extrabold text-white">
                    {getCompanyInitials(job.company.name)}
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-extrabold text-[#2c2935]">
                    {job.company.name}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {job.company.industry || "Accounting Employer"}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3 text-sm font-semibold text-slate-500">
                {job.company.location && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#ff7900]" />
                    {job.company.location}
                  </p>
                )}

                {job.company.website && (
                  <a
                    href={job.company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[#0b5f68] hover:text-[#ff7900]"
                  >
                    <Globe className="h-4 w-4" />
                    Company Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {job.company.description && (
                <p className="mt-5 text-sm leading-6 text-slate-500">
                  {job.company.description}
                </p>
              )}
            </div>

            {/* Apply Card */}
            <div className="rounded-2xl bg-[#0b5f68] p-6 text-white shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <CheckCircle2 className="h-7 w-7 text-[#ff7900]" />
              </div>

              <h2 className="mt-5 text-xl font-extrabold">
                Ready to apply?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/85">
                Login as a jobseeker to apply for this job and track your
                application from your dashboard.
              </p>

             <div className="mt-5">
               <ApplyJobButton slug={job.slug} />
             </div>

            </div>
          </aside>
        </div>
      </section>

      <Footer/>
    </main>
  );
}