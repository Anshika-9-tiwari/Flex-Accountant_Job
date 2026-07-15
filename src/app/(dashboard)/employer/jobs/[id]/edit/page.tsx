// src/app/(dashboard)/employer/jobs/[id]/edit/page.tsx

"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  FileText,
  Loader2,
  MapPin,
  Save,
  Send,
  Wallet,
} from "lucide-react";
import Link from "next/link";

type JobType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "INTERNSHIP";

type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

type JobStatus = "DRAFT" | "PENDING" | "ACTIVE" | "CLOSED" | "REJECTED";

type EditJob = {
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
  company: {
    id: string;
    name: string;
  };
};

const categories = [
  "Accounting",
  "Bookkeeping",
  "Tax Preparation",
  "Audit",
  "Payroll",
  "Accounts Payable",
  "Accounts Receivable",
  "Financial Analyst",
  "Controller/CFO",
  "Accounting Manager",
  "Billing",
  "Forensic Accounting",
  "Cost Accounting",
  "Public Accounting",
  "Corporate Accounting",
];

const jobTypes = [
  { label: "Full Time", value: "FULL_TIME" },
  { label: "Part Time", value: "PART_TIME" },
  { label: "Contract", value: "CONTRACT" },
  { label: "Freelance", value: "FREELANCE" },
  { label: "Internship", value: "INTERNSHIP" },
];

const workModes = [
  { label: "Remote", value: "REMOTE" },
  { label: "Hybrid", value: "HYBRID" },
  { label: "On-site", value: "ONSITE" },
];

const salaryTypes = ["Monthly", "Yearly", "Hourly", "Project Based"];

const experienceOptions = [
  "Entry Level",
  "1 - 3 Years",
  "3 - 5 Years",
  "5 - 8 Years",
  "8+ Years",
];

function toDateInputValue(value: string | null) {
  if (!value) return "";

  return new Date(value).toISOString().split("T")[0];
}

export default function EmployerEditJobPage() {
  const router = useRouter();
  const params = useParams();

  const jobId = String(params.id || "");

  const [job, setJob] = useState<EditJob | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Accounting");
  const [type, setType] = useState<JobType>("FULL_TIME");
  const [workMode, setWorkMode] = useState<WorkMode>("REMOTE");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("1 - 3 Years");

  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [salaryType, setSalaryType] = useState("Monthly");

  const [summary, setSummary] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [skills, setSkills] = useState("");

  const [applyMethod, setApplyMethod] = useState("Internal Apply");
  const [externalApply, setExternalApply] = useState("");
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/employer/jobs/${jobId}`, {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch job.");
          return;
        }

        const fetchedJob: EditJob = data.job;

        setJob(fetchedJob);

        setTitle(fetchedJob.title || "");
        setCategory(fetchedJob.category || "Accounting");
        setType(fetchedJob.type || "FULL_TIME");
        setWorkMode(fetchedJob.workMode || "REMOTE");
        setLocation(fetchedJob.location || "");
        setExperience(fetchedJob.experience || "1 - 3 Years");

        setSalaryMin(
          fetchedJob.salaryMin !== null ? String(fetchedJob.salaryMin) : ""
        );
        setSalaryMax(
          fetchedJob.salaryMax !== null ? String(fetchedJob.salaryMax) : ""
        );
        setSalaryType(fetchedJob.salaryType || "Monthly");

        setSummary(fetchedJob.summary || "");
        setResponsibilities(fetchedJob.responsibilities || "");
        setRequirements(fetchedJob.requirements || "");
        setBenefits(fetchedJob.benefits || "");
        setSkills((fetchedJob.skills || []).join(", "));

        setApplyMethod(fetchedJob.applyMethod || "Internal Apply");
        setExternalApply(fetchedJob.externalApply || "");
        setDeadline(toDateInputValue(fetchedJob.deadline));
      } catch {
        setError("Something went wrong while loading job.");
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch(`/api/employer/jobs/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          category,
          type,
          workMode,
          location,
          experience,
          salaryMin,
          salaryMax,
          salaryType,
          summary,
          responsibilities,
          requirements,
          benefits,
          skills,
          applyMethod,
          externalApply,
          deadline,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update job.");
        return;
      }

      setSuccess("Job updated successfully and sent for admin review.");

      setTimeout(() => {
        router.push("/employer/jobs");
        router.refresh();
      }, 900);
    } catch {
      setError("Something went wrong while updating job.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading job...
          </p>
        </div>
      </section>
    );
  }

  if (error && !job) {
    return (
      <section className="space-y-5">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
          {error}
        </div>

        <Link
          href="/employer/jobs"
          className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Jobs
        </Link>
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
              Edit Job
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Update job post
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Update your job details. After saving, this job will go back to
              pending status for admin review.
            </p>
          </div>

          <Link
            href="/employer/jobs"
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Jobs
          </Link>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#2c2935]">
                Basic Job Details
              </h2>
              <p className="text-sm text-slate-500">
                Job title, category, type, location, and work mode.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Job Title
              </label>

              <input
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Example: Remote Bookkeeper"
                className="input input-bordered h-13 w-full rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Category
              </label>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="select select-bordered h-13 w-full rounded-xl bg-white"
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Job Type
              </label>

              <select
                value={type}
                onChange={(event) => setType(event.target.value as JobType)}
                className="select select-bordered h-13 w-full rounded-xl bg-white"
              >
                {jobTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Work Mode
              </label>

              <select
                value={workMode}
                onChange={(event) =>
                  setWorkMode(event.target.value as WorkMode)
                }
                className="select select-bordered h-13 w-full rounded-xl bg-white"
              >
                {workModes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Experience
              </label>

              <select
                value={experience}
                onChange={(event) => setExperience(event.target.value)}
                className="select select-bordered h-13 w-full rounded-xl bg-white"
              >
                {experienceOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Location
              </label>

              <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                <MapPin className="mr-3 h-5 w-5 text-[#ff7900]" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Remote, United States"
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
              <Wallet className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#2c2935]">
                Salary Details
              </h2>
              <p className="text-sm text-slate-500">
                Add salary range or leave it blank.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Minimum Salary
              </label>

              <input
                type="number"
                value={salaryMin}
                onChange={(event) => setSalaryMin(event.target.value)}
                placeholder="3000"
                className="input input-bordered h-13 w-full rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Maximum Salary
              </label>

              <input
                type="number"
                value={salaryMax}
                onChange={(event) => setSalaryMax(event.target.value)}
                placeholder="5000"
                className="input input-bordered h-13 w-full rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Salary Type
              </label>

              <select
                value={salaryType}
                onChange={(event) => setSalaryType(event.target.value)}
                className="select select-bordered h-13 w-full rounded-xl bg-white"
              >
                {salaryTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
              <FileText className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#2c2935]">
                Job Description
              </h2>
              <p className="text-sm text-slate-500">
                Add summary, responsibilities, requirements, and benefits.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Summary
              </label>

              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Write a short summary of the job..."
                className="textarea textarea-bordered min-h-28 w-full rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Responsibilities
              </label>

              <textarea
                value={responsibilities}
                onChange={(event) => setResponsibilities(event.target.value)}
                placeholder="Add responsibilities..."
                className="textarea textarea-bordered min-h-32 w-full rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Requirements
              </label>

              <textarea
                value={requirements}
                onChange={(event) => setRequirements(event.target.value)}
                placeholder="Add candidate requirements..."
                className="textarea textarea-bordered min-h-32 w-full rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Benefits
              </label>

              <textarea
                value={benefits}
                onChange={(event) => setBenefits(event.target.value)}
                placeholder="Add job benefits..."
                className="textarea textarea-bordered min-h-28 w-full rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Skills
              </label>

              <input
                type="text"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                placeholder="QuickBooks, Tax, Payroll, Excel"
                className="input input-bordered h-13 w-full rounded-xl bg-white"
              />

              <p className="mt-2 text-xs font-semibold text-slate-400">
                Separate skills with commas.
              </p>
            </div>
          </div>
        </div>

        {/* Apply Settings */}
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
              <Send className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#2c2935]">
                Application Settings
              </h2>
              <p className="text-sm text-slate-500">
                Choose how candidates should apply.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Apply Method
              </label>

              <select
                value={applyMethod}
                onChange={(event) => setApplyMethod(event.target.value)}
                className="select select-bordered h-13 w-full rounded-xl bg-white"
              >
                <option>Internal Apply</option>
                <option>External Link</option>
                <option>Email Apply</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                Deadline
              </label>

              <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                <CalendarDays className="mr-3 h-5 w-5 text-[#ff7900]" />
                <input
                  type="date"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="w-full bg-transparent py-3 outline-none"
                />
              </div>
            </div>

            {applyMethod !== "Internal Apply" && (
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  External Apply URL or Email
                </label>

                <input
                  type="text"
                  value={externalApply}
                  onChange={(event) => setExternalApply(event.target.value)}
                  placeholder="https://company.com/apply or hiring@company.com"
                  className="input input-bordered h-13 w-full rounded-xl bg-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Company + Current Status */}
        {job && (
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#f5f7fb] p-5">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-[#ff7900]" />
                  <p className="text-sm font-bold uppercase text-slate-400">
                    Company
                  </p>
                </div>

                <p className="mt-3 text-lg font-extrabold text-[#2c2935]">
                  {job.company.name}
                </p>
              </div>

              <div className="rounded-2xl bg-[#f5f7fb] p-5">
                <p className="text-sm font-bold uppercase text-slate-400">
                  Current Status
                </p>

                <p className="mt-3 text-lg font-extrabold text-[#2c2935]">
                  {job.status}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  After saving changes, status will become PENDING.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col justify-end gap-3 rounded-2xl bg-white p-6 shadow-sm sm:flex-row">
          <Link
            href="/employer/jobs"
            className="btn border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5" />
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="btn border-none bg-[#ff7900] px-8 text-white hover:bg-[#e86e00]"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}