// src/app/(dashboard)/admin/employers/page.tsx

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  User,
  Users,
  XCircle,
} from "lucide-react";

type JobStatus = "DRAFT" | "PENDING" | "ACTIVE" | "CLOSED" | "REJECTED";

type AdminEmployer = {
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
      title: string;
      status: JobStatus;
      applications: {
        id: string;
      }[];
    }[];
  } | null;
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

export default function AdminEmployersPage() {
  const [employers, setEmployers] = useState<AdminEmployer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const [search, setSearch] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("All Status");
  const [industryFilter, setIndustryFilter] = useState("All Industries");

  useEffect(() => {
    async function fetchEmployers() {
      try {
        const response = await fetch("/api/admin/employers", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch employers.");
          return;
        }

        setEmployers(data.employers || []);
      } catch {
        setError("Something went wrong while loading employers.");
      } finally {
        setLoading(false);
      }
    }

    fetchEmployers();
  }, []);

  const industries = useMemo(() => {
    const uniqueIndustries = Array.from(
      new Set(
        employers
          .map((employer) => employer.company?.industry)
          .filter(Boolean) as string[]
      )
    );

    return ["All Industries", ...uniqueIndustries];
  }, [employers]);

  const filteredEmployers = useMemo(() => {
    return employers.filter((employer) => {
      const keyword = search.toLowerCase();
      const companyName = employer.company?.name || "";
      const industry = employer.company?.industry || "";
      const location = employer.company?.location || "";

      const matchesSearch =
        employer.user.name.toLowerCase().includes(keyword) ||
        employer.user.email.toLowerCase().includes(keyword) ||
        companyName.toLowerCase().includes(keyword) ||
        industry.toLowerCase().includes(keyword) ||
        location.toLowerCase().includes(keyword);

      const matchesVerification =
        verificationFilter === "All Status" ||
        (verificationFilter === "Verified" && employer.isVerified) ||
        (verificationFilter === "Unverified" && !employer.isVerified);

      const matchesIndustry =
        industryFilter === "All Industries" || industry === industryFilter;

      return matchesSearch && matchesVerification && matchesIndustry;
    });
  }, [employers, search, verificationFilter, industryFilter]);

  const totalEmployers = employers.length;
  const verifiedEmployers = employers.filter(
    (employer) => employer.isVerified
  ).length;
  const unverifiedEmployers = employers.filter(
    (employer) => !employer.isVerified
  ).length;
  const totalJobs = employers.reduce(
    (total, employer) => total + (employer.company?.jobs.length || 0),
    0
  );

  async function updateEmployerVerification(
    employerId: string,
    isVerified: boolean
  ) {
    setError("");
    setSuccess("");
    setUpdatingId(employerId);

    try {
      const response = await fetch(`/api/admin/employers/${employerId}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          isVerified,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update employer verification.");
        return;
      }

      setEmployers((currentEmployers) =>
        currentEmployers.map((employer) =>
          employer.id === employerId
            ? {
                ...employer,
                isVerified,
              }
            : employer
        )
      );

      setSuccess(data.message || "Employer verification updated successfully.");
    } catch {
      setError("Something went wrong while updating employer verification.");
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
              Admin Employers
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Manage employer companies
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              View employer profiles, company details, posted jobs, and verify
              or unverify employer accounts.
            </p>
          </div>

          <Link
            href="/admin/approvals"
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <ShieldCheck className="h-5 w-5" />
            Pending Approvals
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Total Employers
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {totalEmployers}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Verified</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {verifiedEmployers}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Unverified</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {unverifiedEmployers}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Posted Jobs</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#2c2935]">
            {totalJobs}
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
              placeholder="Search by employer, email, company, industry, or location..."
              className="w-full bg-transparent py-3 outline-none"
            />
          </div>

          <select
            value={verificationFilter}
            onChange={(event) => setVerificationFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            <option>All Status</option>
            <option>Verified</option>
            <option>Unverified</option>
          </select>

          <select
            value={industryFilter}
            onChange={(event) => setIndustryFilter(event.target.value)}
            className="select select-bordered h-13 w-full rounded-xl bg-white"
          >
            {industries.map((industry) => (
              <option key={industry}>{industry}</option>
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
              Loading employers...
            </p>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filteredEmployers.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
            <Building2 className="h-8 w-8" />
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-[#2c2935]">
            No employers found
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            No employer profiles match your current filters.
          </p>
        </div>
      )}

      {/* Employer Cards */}
      {!loading && !error && filteredEmployers.length > 0 && (
        <div className="space-y-5">
          {filteredEmployers.map((employer) => {
            const company = employer.company;
            const jobs = company?.jobs || [];
            const activeJobs = jobs.filter(
              (job) => job.status === "ACTIVE"
            ).length;
            const pendingJobs = jobs.filter(
              (job) => job.status === "PENDING"
            ).length;
            const applications = jobs.reduce(
              (total, job) => total + job.applications.length,
              0
            );

            return (
              <article
                key={employer.id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex flex-col justify-between gap-6 xl:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      {employer.isVerified ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          VERIFIED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                          <Clock className="h-4 w-4" />
                          UNVERIFIED
                        </span>
                      )}

                      {employer.user.isActive ? (
                        <span className="rounded-full bg-[#0b5f68]/10 px-3 py-1 text-xs font-bold text-[#0b5f68]">
                          Active Account
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">
                          Inactive Account
                        </span>
                      )}

                      <span className="rounded-full bg-[#ff7900]/10 px-3 py-1 text-xs font-bold text-[#ff7900]">
                        Employer
                      </span>
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

                    <div className="mt-5 grid gap-4 rounded-2xl bg-[#f5f7fb] p-4 sm:grid-cols-4">
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
                          {pendingJobs}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase text-slate-400">
                          Applications
                        </p>
                        <p className="mt-1 text-lg font-extrabold text-[#2c2935]">
                          {applications}
                        </p>
                      </div>
                    </div>

                    {company?.description && (
                      <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-500">
                        {company.description}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 xl:w-[220px]">
                    <Link
                      href="/admin/jobs"
                      className="btn border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                    >
                      <BriefcaseBusiness className="h-5 w-5" />
                      View Jobs
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
                      disabled={updatingId === employer.id}
                      onClick={() =>
                        updateEmployerVerification(
                          employer.id,
                          !employer.isVerified
                        )
                      }
                      className={
                        employer.isVerified
                          ? "btn border border-red-200 bg-white text-red-600 hover:bg-red-600 hover:text-white"
                          : "btn border-none bg-green-600 text-white hover:bg-green-700"
                      }
                    >
                      {updatingId === employer.id ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Updating...
                        </>
                      ) : employer.isVerified ? (
                        <>
                          <XCircle className="h-5 w-5" />
                          Unverify
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-5 w-5" />
                          Verify
                        </>
                      )}
                    </button>
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