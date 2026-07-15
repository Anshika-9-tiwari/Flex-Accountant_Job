// src/app/(dashboard)/admin/applications/page.tsx

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
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  User,
  Users,
  XCircle,
} from "lucide-react";

type ApplicationStatus =
  | "APPLIED"
  | "REVIEWED"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "REJECTED"
  | "HIRED";

type JobStatus = "DRAFT" | "PENDING" | "ACTIVE" | "CLOSED" | "REJECTED";

type AdminApplication = {
  id: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  resumeUrl: string | null;
  createdAt: string;
  updatedAt: string;
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
    location: string;
    status: JobStatus;
    company: {
      id: string;
      name: string;
      industry: string | null;
      website: string | null;
      location: string | null;
    };
  };
};

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

function getStatusIcon(status: ApplicationStatus) {
  if (status === "HIRED") return CheckCircle2;
  if (status === "REJECTED") return XCircle;
  if (status === "INTERVIEW") return Clock;
  if (status === "SHORTLISTED") return CheckCircle2;
  return FileText;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const [jobFilter, setJobFilter] = useState("All Jobs");

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch("/api/admin/applications", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch applications.");
          return;
        }

        setApplications(data.applications || []);
      } catch {
        setError("Something went wrong while loading applications.");
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  const companies = useMemo(() => {
    const uniqueCompanies = Array.from(
      new Set(applications.map((application) => application.job.company.name))
    );

    return ["All Companies", ...uniqueCompanies];
  }, [applications]);

  const jobs = useMemo(() => {
    const uniqueJobs = Array.from(
      new Set(applications.map((application) => application.job.title))
    );

    return ["All Jobs", ...uniqueJobs];
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        application.user.name.toLowerCase().includes(keyword) ||
        application.user.email.toLowerCase().includes(keyword) ||
        application.job.title.toLowerCase().includes(keyword) ||
        application.job.company.name.toLowerCase().includes(keyword) ||
        application.job.category.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "All Status" || application.status === statusFilter;

      const matchesCompany =
        companyFilter === "All Companies" ||
        application.job.company.name === companyFilter;

      const matchesJob =
        jobFilter === "All Jobs" || application.job.title === jobFilter;

      return matchesSearch && matchesStatus && matchesCompany && matchesJob;
    });
  }, [applications, search, statusFilter, companyFilter, jobFilter]);

  const totalApplications = applications.length;
  const appliedApplications = applications.filter(
    (application) => application.status === "APPLIED"
  ).length;
  const reviewedApplications = applications.filter(
    (application) => application.status === "REVIEWED"
  ).length;
  const shortlistedApplications = applications.filter(
    (application) => application.status === "SHORTLISTED"
  ).length;
  const interviewApplications = applications.filter(
    (application) => application.status === "INTERVIEW"
  ).length;
  const hiredApplications = applications.filter(
    (application) => application.status === "HIRED"
  ).length;

  async function updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(applicationId);

    try {
      const response = await fetch(
        `/api/admin/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update application status.");
        return;
      }

      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );

      setSuccess("Application status updated successfully.");
    } catch {
      setError("Something went wrong while updating application status.");
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
              Admin Applications
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Manage all job applications
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              View every application across jobseekers, employers, jobs, and
              companies.
            </p>
          </div>

          <Link
            href="/admin/jobs"
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <BriefcaseBusiness className="h-5 w-5" />
            Manage Jobs
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Total</p>
          <h2 className="mt-2 text-3xl font-bold text-[#2c2935]">
            {totalApplications}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Applied</p>
          <h2 className="mt-2 text-3xl font-bold text-[#2c2935]">
            {appliedApplications}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Reviewed</p>
          <h2 className="mt-2 text-3xl font-bold text-[#2c2935]">
            {reviewedApplications}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Shortlisted</p>
          <h2 className="mt-2 text-3xl font-bold text-[#2c2935]">
            {shortlistedApplications}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Interview</p>
          <h2 className="mt-2 text-3xl font-bold text-[#2c2935]">
            {interviewApplications}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Hired</p>
          <h2 className="mt-2 text-3xl font-bold text-[#2c2935]">
            {hiredApplications}
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
        <div className="grid gap-4 xl:grid-cols-[1fr_180px_240px_240px]">
          <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
            <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search candidate, email, job, company, or category..."
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            <option>All Status</option>
            <option value="APPLIED">Applied</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="REJECTED">Rejected</option>
            <option value="HIRED">Hired</option>
          </select>

          <select
            value={companyFilter}
            onChange={(event) => setCompanyFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            {companies.map((company) => (
              <option key={company}>{company}</option>
            ))}
          </select>

          <select
            value={jobFilter}
            onChange={(event) => setJobFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            {jobs.map((job) => (
              <option key={job}>{job}</option>
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
              Loading applications...
            </p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredApplications.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
            <FileText className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
            No applications found
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            No applications match your current filters.
          </p>
        </div>
      )}

      {/* Application Cards */}
      {!loading && !error && filteredApplications.length > 0 && (
        <div className="space-y-5">
          {filteredApplications.map((application) => {
            const StatusIcon = getStatusIcon(application.status);

            return (
              <article
                key={application.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-6 xl:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                          application.status
                        )}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        {application.status}
                      </span>

                      <span className="rounded-full bg-[#ff7900]/10 px-3 py-1 text-xs font-bold text-[#ff7900]">
                        {application.job.category}
                      </span>

                      <span className="rounded-full bg-[#0b5f68]/10 px-3 py-1 text-xs font-bold text-[#0b5f68] tracking-wide">
                        {application.job.status} JOB
                      </span>
                    </div>

                    <div className="flex items-start gap-4">
                      {application.user.image ? (
                        <img
                          src={application.user.image}
                          alt={application.user.name}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0b5f68] text-xl font-extrabold text-white">
                          {getInitials(application.user.name)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h2 className="text-2xl font-bold text-[#2c2935]">
                          {application.user.name}
                        </h2>

                        <p className="mt-1 text-sm font-semibold text-slate-500">
                          {application.user.jobseekerProfile?.headline ||
                            "Accounting Candidate"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-600 md:grid-cols-2 xl:grid-cols-4">
                      <span className="inline-flex items-center gap-2">
                        <BriefcaseBusiness className="h-4 w-4 text-[#ff7900]" />
                        {application.job.title}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-[#ff7900]" />
                        {application.job.company.name}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#ff7900]" />
                        {application.user.jobseekerProfile?.location ||
                          application.job.location}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#ff7900]" />
                        Applied {formatDate(application.createdAt)}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-500 md:grid-cols-2">
                      <a
                        href={`mailto:${application.user.email}`}
                        className="inline-flex items-center gap-2 text-[#0b5f68] hover:text-[#ff7900]"
                      >
                        <Mail className="h-4 w-4" />
                        {application.user.email}
                      </a>

                      {application.user.phone && (
                        <a
                          href={`tel:${application.user.phone}`}
                          className="inline-flex items-center gap-2 text-[#0b5f68] hover:text-[#ff7900]"
                        >
                          <Phone className="h-4 w-4" />
                          {application.user.phone}
                        </a>
                      )}
                    </div>

                    {application.user.jobseekerProfile?.skills &&
                      application.user.jobseekerProfile.skills.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {application.user.jobseekerProfile.skills
                            .slice(0, 8)
                            .map((skill) => (
                              <span
                                key={skill}
                                className="rounded-full bg-[#ff7900]/30 px-3 py-1 text-xs font-bold text-orange-500"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 xl:w-[220px]">
                    <Link
                      href={`/jobs/${application.job.slug}`}
                      className="btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                    >
                      <Eye className="h-5 w-5" />
                      View Job
                    </Link>

                    {application.resumeUrl ||
                    application.user.jobseekerProfile?.resumeUrl ? (
                      <a
                        href={
                          application.resumeUrl ||
                          application.user.jobseekerProfile?.resumeUrl ||
                          "#"
                        }
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

                    <select
                      value={application.status}
                      disabled={updatingId === application.id}
                      onChange={(event) =>
                        updateApplicationStatus(
                          application.id,
                          event.target.value as ApplicationStatus
                        )
                      }
                      className="select select-bordered h-12 w-full rounded-xl bg-white"
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="HIRED">Hired</option>
                    </select>

                    {updatingId === application.id && (
                      <p className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </p>
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