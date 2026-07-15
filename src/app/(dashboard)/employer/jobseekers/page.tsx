// src/app/(dashboard)/employer/candidates/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  User,
  Users,
} from "lucide-react";

type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  createdAt: string;
  jobseekerProfile: {
    headline: string | null;
    location: string | null;
    experience: string | null;
    skills: string[];
    resumeUrl: string | null;
    bio: string | null;
  } | null;
  applications: {
    id: string;
    status: string;
    createdAt: string;
    job: {
      id: string;
      title: string;
      slug: string;
      category: string;
      status: string;
      createdAt: string;
    };
  }[];
};

type CandidatesData = {
  company: {
    id: string;
    name: string;
  } | null;
  candidates: Candidate[];
  stats: {
    totalCandidates: number;
    candidatesWithResume: number;
    candidatesAppliedToCompany: number;
  };
};

const experienceOptions = [
  "All Experience",
  "Entry Level",
  "1 - 3 Years",
  "3 - 5 Years",
  "5 - 8 Years",
  "8+ Years",
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getProfileCompletion(candidate: Candidate) {
  const profile = candidate.jobseekerProfile;

  const items = [
    Boolean(candidate.name),
    Boolean(candidate.phone),
    Boolean(profile?.headline),
    Boolean(profile?.location),
    Boolean(profile?.experience),
    Boolean(profile?.skills?.length),
    Boolean(profile?.resumeUrl),
    Boolean(profile?.bio),
  ];

  return Math.round((items.filter(Boolean).length / items.length) * 100);
}

export default function EmployerCandidatesPage() {
  const [data, setData] = useState<CandidatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("All Experience");
  const [resumeFilter, setResumeFilter] = useState("All Candidates");
  const [applicationFilter, setApplicationFilter] = useState("All Candidates");

  useEffect(() => {
    async function fetchCandidates() {
      try {
        const response = await fetch("/api/employer/candidates", {
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.message || "Failed to fetch candidates.");
          return;
        }

        setData(result);
      } catch {
        setError("Something went wrong while loading candidates.");
      } finally {
        setLoading(false);
      }
    }

    fetchCandidates();
  }, []);

  const filteredCandidates = useMemo(() => {
    const candidates = data?.candidates || [];

    return candidates.filter((candidate) => {
      const keyword = search.toLowerCase();
      const profile = candidate.jobseekerProfile;

      const skills = profile?.skills?.join(" ") || "";

      const matchesSearch =
        candidate.name.toLowerCase().includes(keyword) ||
        candidate.email.toLowerCase().includes(keyword) ||
        (profile?.headline || "").toLowerCase().includes(keyword) ||
        (profile?.location || "").toLowerCase().includes(keyword) ||
        (profile?.experience || "").toLowerCase().includes(keyword) ||
        skills.toLowerCase().includes(keyword);

      const matchesExperience =
        experienceFilter === "All Experience" ||
        profile?.experience === experienceFilter;

      const matchesResume =
        resumeFilter === "All Candidates" ||
        (resumeFilter === "With Resume" && Boolean(profile?.resumeUrl)) ||
        (resumeFilter === "Without Resume" && !profile?.resumeUrl);

      const matchesApplication =
        applicationFilter === "All Candidates" ||
        (applicationFilter === "Applied To My Company" &&
          candidate.applications.length > 0) ||
        (applicationFilter === "Not Applied Yet" &&
          candidate.applications.length === 0);

      return (
        matchesSearch &&
        matchesExperience &&
        matchesResume &&
        matchesApplication
      );
    });
  }, [data, search, experienceFilter, resumeFilter, applicationFilter]);

  if (loading) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading candidates...
          </p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
        {error || "Candidate data not found."}
      </section>
    );
  }

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Candidates
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Search jobseeker profiles
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Browse active jobseekers, review skills and resumes, and message
              candidates who applied to your jobs.
            </p>
          </div>

          <Link
            href="/employer/applicants"
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <Users className="h-5 w-5" />
            View Applicants
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total Candidates
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {data.stats.totalCandidates}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">With Resume</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {data.stats.candidatesWithResume}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Applied To You
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {data.stats.candidatesAppliedToCompany}
          </h2>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1fr_200px_200px_240px]">
          <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
            <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, headline, location, or skills..."
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>

          <select
            value={experienceFilter}
            onChange={(event) => setExperienceFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            {experienceOptions.map((experience) => (
              <option key={experience}>{experience}</option>
            ))}
          </select>

          <select
            value={resumeFilter}
            onChange={(event) => setResumeFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            <option>All Candidates</option>
            <option>With Resume</option>
            <option>Without Resume</option>
          </select>

          <select
            value={applicationFilter}
            onChange={(event) => setApplicationFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            <option>All Candidates</option>
            <option>Applied To My Company</option>
            <option>Not Applied Yet</option>
          </select>
        </div>
      </div>

      {/* Empty */}
      {filteredCandidates.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
            <User className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
            No candidates found
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            No jobseekers match your current search and filters.
          </p>
        </div>
      )}

      {/* Candidates */}
      {filteredCandidates.length > 0 && (
        <div className="space-y-5">
          {filteredCandidates.map((candidate) => {
            const profile = candidate.jobseekerProfile;
            const completion = getProfileCompletion(candidate);
            const appliedToCompany = candidate.applications.length > 0;
            const latestApplication = candidate.applications[0];

            return (
              <article
                key={candidate.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-6 xl:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {appliedToCompany ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          APPLIED TO YOUR COMPANY
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          Candidate Profile
                        </span>
                      )}

                      {profile?.experience && (
                        <span className="rounded-full bg-[#ff7900]/10 px-3 py-1 text-xs font-bold text-[#ff7900]">
                          {profile.experience}
                        </span>
                      )}

                      <span className="rounded-full bg-[#0b5f68]/10 px-3 py-1 text-xs font-bold text-[#0b5f68]">
                        {completion}% Complete
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      {candidate.image ? (
                        <img
                          src={candidate.image}
                          alt={candidate.name}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0b5f68] text-xl font-extrabold text-white">
                          {getInitials(candidate.name)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h2 className="text-2xl font-extrabold text-[#2c2935]">
                          {candidate.name}
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {profile?.headline || "Accounting Candidate"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-12 text-sm font-semibold text-slate-500 md:grid-cols-2 xl:grid-cols-4">
                      <a
                        href={`mailto:${candidate.email}`}
                        className="inline-flex items-center gap-2 text-[#0b5f68] hover:text-[#ff7900]"
                      >
                        <Mail className="h-4 w-4" />
                        {candidate.email}
                      </a>

                      {candidate.phone && (
                        <a
                          href={`tel:${candidate.phone}`}
                          className="inline-flex items-center gap-2 text-[#0b5f68] hover:text-[#ff7900]"
                        >
                          <Phone className="h-4 w-4" />
                          {candidate.phone}
                        </a>
                      )}

                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#ff7900]" />
                        {profile?.location || "Location not added"}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#ff7900]" />
                        Joined {formatDate(candidate.createdAt)}
                      </span>
                    </div>

                    {profile?.skills && profile.skills.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {profile.skills.slice(0, 10).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-[#f5f7fb] px-3 py-1 text-xs font-bold text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {profile?.bio && (
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-500">
                        {profile.bio}
                      </p>
                    )}

                    {latestApplication && (
                      <div className="mt-5 rounded-2xl bg-[#f5f7fb] p-4">
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Latest Application To Your Company
                        </p>

                        <p className="mt-2 font-extrabold text-[#2c2935]">
                          {latestApplication.job.title}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          Status: {latestApplication.status} • Applied{" "}
                          {formatDate(latestApplication.createdAt)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 xl:w-[220px]">
                    {profile?.resumeUrl ? (
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn border border-[#ff7900] bg-white text-[#ff7900] hover:bg-[#ff7900] hover:text-white"
                      >
                        <FileText className="h-5 w-5" />
                        View Resume
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="btn border border-slate-200 bg-slate-100 text-slate-400"
                      >
                        <FileText className="h-5 w-5" />
                        No Resume
                      </button>
                    )}

                    {appliedToCompany ? (
                      <Link
                        href="/employer/message"
                        className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
                      >
                        <MessageSquare className="h-5 w-5" />
                        Message
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="btn border border-slate-200 bg-slate-100 text-slate-400"
                        title="Messaging is available after a candidate applies to your job."
                      >
                        <MessageSquare className="h-5 w-5" />
                        Message Locked
                      </button>
                    )}

                    {appliedToCompany ? (
                      <Link
                        href="/employer/applicants"
                        className="btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                      >
                        <BriefcaseBusiness className="h-5 w-5" />
                        View Application
                      </Link>
                    ) : (
                      <Link
                        href="/employer/jobs/new"
                        className="btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                      >
                        <BriefcaseBusiness className="h-5 w-5" />
                        Post Job
                      </Link>
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