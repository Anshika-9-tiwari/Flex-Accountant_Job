// src/app/(dashboard)/employer/jobs/new/page.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  DollarSign,
  FilePlus2,
  Globe,
  ListChecks,
  Loader2,
  MapPin,
  Save,
  Send,
} from "lucide-react";

const categories = [
  "Accounting",
  "Bookkeeping",
  "Tax",
  "Audit",
  "Payroll",
  "Accounts Receivable",
  "Accounts Payable",
  "Financial Analyst",
  "Controller / CFO",
  "Accounting Manager",
  "Billing",
  "Forensic Accounting",
  "Cost Accounting",
  "Public Accounting",
  "Corporate Accounting",
  "Other"
];

export default function EmployerPostNewJobPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("Full Time");
  const [workMode, setWorkMode] = useState("Remote");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("Remote");
  const [salaryType, setSalaryType] = useState("Yearly");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [summary, setSummary] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [skills, setSkills] = useState("");
  const [applyMethod, setApplyMethod] = useState("Apply on Flex-Accountant");
  const [externalApply, setExternalApply] = useState("");
  const [deadline, setDeadline] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
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
        setError(data.message || "Failed to create job.");
        return;
      }

      router.push(data.redirectTo || "/employer/jobs");
      router.refresh();
    } catch {
      setError("Something went wrong while creating the job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <Link
              href="/employer/jobs"
              className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Manage Jobs
            </Link>

            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Post New Job
            </p>

            <h1 className="text-3xl font-extrabold sm:text-4xl">
              Create a new accounting job post
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Add job details, requirements, salary, location, and application
              instructions to publish your job on Flex-Accountant.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Publish Job
              </>
            )}
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-8 xl:grid-cols-[1fr_360px]">
        {/* Main Form */}
        <div className="space-y-8">
          {/* Basic Job Information */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Basic Job Information
                </h2>
                <p className="text-sm text-slate-500">
                  Enter the main details candidates will see first.
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
                  placeholder="Example: Remote Senior Accountant"
                  className="input input-bordered h-13 w-full rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Job Category
                </label>
                <select
                  required
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="select select-bordered h-13 w-full rounded-xl bg-white"
                >
                  <option value="">Select category</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Job Type
                </label>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="select select-bordered h-13 w-full rounded-xl bg-white"
                >
                  <option>Full Time</option>
                  {["Part Time", "Contract", "Freelance", "Internship"].map((ind) =>(
                    <option key={ind} value={ind}>
                      {ind}
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
                  onChange={(event) => setWorkMode(event.target.value)}
                  className="select select-bordered h-13 w-full rounded-xl bg-white"
                >
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Experience Level
                </label>
                <select
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                  className="select select-bordered h-13 w-full rounded-xl bg-white"
                >
                  <option value="">Select experience</option>
                  {["Entry Level", "1 - 3 Years", "3 - 5 Years", "5 -8 Years", "8+ Yers"].map((ind)=>(
                    <option key={ind} value={ind} >
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location and Salary */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
                <MapPin className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Location and Salary
                </h2>
                <p className="text-sm text-slate-500">
                  Add job location and compensation details.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
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
                    placeholder="Remote, New York, USA"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
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
                  <option>Yearly</option>
                  <option>Monthly</option>
                  <option>Hourly</option>
                  <option>Fixed Project</option>
                  <option>Not Disclosed</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Minimum Salary
                </label>
                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <DollarSign className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="number"
                    value={salaryMin}
                    onChange={(event) => setSalaryMin(event.target.value)}
                    placeholder="45000"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Maximum Salary
                </label>
                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <DollarSign className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="number"
                    value={salaryMax}
                    onChange={(event) => setSalaryMax(event.target.value)}
                    placeholder="65000"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <ListChecks className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Job Description
                </h2>
                <p className="text-sm text-slate-500">
                  Explain the role, duties, requirements, and benefits.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Short Summary
                </label>
                <textarea
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                  placeholder="Write a short summary of this job..."
                  className="textarea textarea-bordered min-h-28 w-full rounded-xl bg-white"
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Responsibilities
                </label>
                <textarea
                  value={responsibilities}
                  onChange={(event) => setResponsibilities(event.target.value)}
                  placeholder="Example: Prepare monthly financial reports, perform reconciliations, support month-end close..."
                  className="textarea textarea-bordered min-h-36 w-full rounded-xl bg-white"
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Requirements
                </label>
                <textarea
                  value={requirements}
                  onChange={(event) => setRequirements(event.target.value)}
                  placeholder="Example: 3+ years accounting experience, QuickBooks knowledge, strong Excel skills..."
                  className="textarea textarea-bordered min-h-36 w-full rounded-xl bg-white"
                ></textarea>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Benefits
                </label>
                <textarea
                  value={benefits}
                  onChange={(event) => setBenefits(event.target.value)}
                  placeholder="Example: Remote work, flexible schedule, paid time off, growth opportunities..."
                  className="textarea textarea-bordered min-h-32 w-full rounded-xl bg-white"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
                <ListChecks className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Required Skills
                </h2>
                <p className="text-sm text-slate-500">
                  Add skills separated by commas.
                </p>
              </div>
            </div>

            <input
              type="text"
              value={skills}
              onChange={(event) => setSkills(event.target.value)}
              placeholder="QuickBooks, Xero, Excel, Tax Preparation, Payroll"
              className="input input-bordered h-13 w-full rounded-xl bg-white"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {(skills
                ? skills.split(",").map((item) => item.trim()).filter(Boolean)
                : ["QuickBooks", "Excel", "Reconciliation", "Payroll"]
              ).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#ff7900]/10 px-4 py-2 text-sm font-bold text-[#ff7900]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Application Settings */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <Globe className="h-6 w-6" />
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
                  <option>Apply on Flex-Accountant</option>
                  <option>External Website</option>
                  <option>Email Application</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Application Deadline
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

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  External Apply Link or Email
                </label>
                <input
                  type="text"
                  value={externalApply}
                  onChange={(event) => setExternalApply(event.target.value)}
                  placeholder="https://company.com/careers or hr@company.com"
                  className="input input-bordered h-13 w-full rounded-xl bg-white"
                />
              </div>
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="flex flex-col justify-end gap-3 sm:flex-row">
            <button
              type="button"
              className="btn border border-[#0b5f68] bg-white px-8 text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
            >
              <Save className="h-5 w-5" />
              Save Draft
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn border-none bg-[#ff7900] px-8 text-white hover:bg-[#e86e00]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Publish Job
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Preview Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
              <FilePlus2 className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#2c2935]">
              Job Preview
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your job post will be visible to job seekers after admin approval.
            </p>

            <div className="mt-5 rounded-2xl border border-base-300 p-4">
              <p className="text-sm font-semibold text-slate-500">Job Title</p>
              <h4 className="mt-1 font-extrabold text-[#2c2935]">
                {title || "Remote Senior Accountant"}
              </h4>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>{location || "Remote"}</p>
                <p>{type}</p>
                <p>
                  {salaryMin || salaryMax
                    ? `$${salaryMin || "0"} - $${salaryMax || "0"} / ${salaryType}`
                    : "Salary not disclosed"}
                </p>
              </div>
            </div>
          </div>

          {/* Company */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <Building2 className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[#2c2935]">
                  Company Profile
                </h3>
                <p className="text-sm text-slate-500">Required for posting</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              A completed company profile improves job trust and application
              quality.
            </p>

            <Link
              href="/employer/company"
              className="btn mt-5 w-full border border-[#0b5f68] bg-white text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
            >
              Update Company
            </Link>
          </div>

          {/* Posting Tips */}
          <div className="rounded-2xl bg-[#0b5f68] p-6 text-white shadow-sm">
            <h3 className="text-xl font-extrabold">Job Posting Tips</h3>

            <ul className="mt-5 space-y-3 text-sm leading-6 text-white/90">
              <li>Use a clear accounting job title.</li>
              <li>Mention remote, hybrid, or on-site clearly.</li>
              <li>Add salary range when possible.</li>
              <li>Keep requirements realistic and specific.</li>
              <li>Explain application steps clearly.</li>
            </ul>
          </div>

          {/* Free Posting */}
          <div className="rounded-2xl bg-[#ff7900] p-6 text-white shadow-sm">
            <h3 className="text-xl font-extrabold">Free Job Posting</h3>

            <p className="mt-3 text-sm leading-6 text-white/90">
              Employer job posting is currently free on Flex-Accountant.
            </p>
          </div>
        </aside>
      </section>
    </form>
  );
}