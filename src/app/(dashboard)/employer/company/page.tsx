// src/app/(dashboard)/employer/company/page.tsx

"use client";

import { FormEvent, useEffect, useState } from "react";
import FileUploadField from "@/Components/Dashboard/FileUploadField";
import {
  Building2,
  CheckCircle2,
  FileText,
  Globe,
  ImageIcon,
  Link as LinkIcon,
  Loader2,
  MapPin,
  Phone,
  Save,
  User,
  Users,
} from "lucide-react";

type EmployerCompanyResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    employerProfile: {
      designation: string | null;
      isVerified: boolean;
      company: {
        id: string;
        name: string;
        industry: string | null;
        size: string | null;
        website: string | null;
        location: string | null;
        logoUrl: string | null;
        description: string | null;
      } | null;
    } | null;
  };
};

function getCompanyInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function EmployerCompanyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [designation, setDesignation] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchCompanyProfile() {
      try {
        const response = await fetch("/api/employer/company", {
          credentials: "include",
          cache: "no-store",
        });

        const data: EmployerCompanyResponse & { message?: string } =
          await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch company profile.");
          return;
        }

        const user = data.user;
        const employerProfile = user.employerProfile;
        const company = employerProfile?.company;

        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setDesignation(employerProfile?.designation || "");

        setCompanyName(company?.name || "");
        setIndustry(company?.industry || "");
        setSize(company?.size || "");
        setWebsite(company?.website || "");
        setLocation(company?.location || "");
        setLogoUrl(company?.logoUrl || "");
        setDescription(company?.description || "");
        setIsVerified(Boolean(employerProfile?.isVerified));
      } catch {
        setError("Something went wrong while loading company profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyProfile();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/employer/company", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          phone,
          designation,
          companyName,
          industry,
          size,
          website,
          location,
          logoUrl,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update company profile.");
        return;
      }

      setSuccess("Company profile updated successfully.");
    } catch {
      setError("Something went wrong while saving company profile.");
    } finally {
      setSaving(false);
    }
  }

  const completedItems = [
    Boolean(name),
    Boolean(phone),
    Boolean(designation),
    Boolean(companyName),
    Boolean(industry),
    Boolean(size),
    Boolean(website),
    Boolean(location),
    Boolean(logoUrl),
    Boolean(description),
  ];

  const completionPercent = Math.round(
    (completedItems.filter(Boolean).length / completedItems.length) * 100
  );

  if (loading) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading company profile...
          </p>
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0b5f68] to-[#083f46] p-6 text-white shadow-md sm:p-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Company Profile
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Manage your employer profile
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/80 sm:text-lg">
              Update your company details, contact person, website, location,
              logo, and hiring profile.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Company
              </>
            )}
          </button>
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

      <section className="grid gap-8 xl:grid-cols-[1fr_360px]">
        {/* Main */}
        <div className="space-y-8">
          {/* Contact Person */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <User className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Contact Person
                </h2>
                <p className="text-sm text-slate-500">
                  Employer account and contact information.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Contact Name
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <User className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter contact name"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Email Address
                </label>

                <input
                  type="email"
                  disabled
                  value={email}
                  className="input input-bordered h-13 w-full rounded-xl bg-slate-100 text-slate-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Phone Number
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <Phone className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter phone number"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Designation
                </label>

                <input
                  type="text"
                  value={designation}
                  onChange={(event) => setDesignation(event.target.value)}
                  placeholder="HR Manager, Founder, Recruiter"
                  className="input input-bordered h-13 w-full rounded-xl bg-white"
                />
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
                <Building2 className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Company Information
                </h2>
                <p className="text-sm text-slate-500">
                  Company details shown on jobs and candidate pages.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Company Name
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <Building2 className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                    placeholder="Enter company name"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Industry
                </label>

                <select
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  className="select select-bordered h-13 w-full rounded-xl bg-white"
                >
                  <option value="">Select industry</option>
                  <option>Accounting Firm</option>
                  <option>CPA Firm</option>
                  <option>Bookkeeping Company</option>
                  <option>Tax Services</option>
                  <option>Payroll Services</option>
                  <option>Finance Department</option>
                  <option>Recruitment Agency</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Company Size
                </label>

                <select
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                  className="select select-bordered h-13 w-full rounded-xl bg-white"
                >
                  <option value="">Select company size</option>
                  <option>1 - 10 employees</option>
                  <option>11 - 50 employees</option>
                  <option>51 - 200 employees</option>
                  <option>201 - 500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Website
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <Globe className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="url"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    placeholder="https://company.com"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Location
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <MapPin className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="City, State, Country or Remote"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Company Logo */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <ImageIcon className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Company Logo
                </h2>
                <p className="text-sm text-slate-500">
                  Upload a logo or paste a logo URL.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FileUploadField
                label="Upload Company Logo"
                uploadUrl="/api/upload/company-logo"
                accept="image/jpeg,image/png,image/webp"
                currentUrl={logoUrl}
                buttonText="Upload Company Logo"
                onUploaded={(url) => {
                  setLogoUrl(url);
                  setSuccess("Company logo uploaded. Click Save Company to store it.");
                }}
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Logo URL
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <ImageIcon className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(event) => setLogoUrl(event.target.value)}
                    placeholder="/uploads/company-logos/logo.png or external URL"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Uploaded logo path will appear here. You can also paste an
                  external image URL.
                </p>
              </div>
            </div>
          </div>

          {/* Company Description */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Company Description
                </h2>
                <p className="text-sm text-slate-500">
                  Short introduction visible to jobseekers.
                </p>
              </div>
            </div>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write a short description about your company..."
              className="textarea textarea-bordered min-h-44 w-full rounded-xl bg-white"
            ></textarea>
          </div>

          <div className="flex justify-end">
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
                  Save Company
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName || "Company logo"}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0b5f68] text-2xl font-extrabold text-white">
                {companyName ? getCompanyInitials(companyName) : "CO"}
              </div>
            )}

            <h3 className="mt-5 text-xl font-extrabold text-[#2c2935]">
              {companyName || "Company Name"}
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {industry || "Industry not added"}
            </p>

            <div className="mt-5 space-y-3 text-sm font-semibold text-slate-500">
              <p>{location || "Location not added"}</p>
              <p>{size || "Company size not added"}</p>

              {website ? (
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[#0b5f68] hover:text-[#ff7900]"
                >
                  <LinkIcon className="h-4 w-4" />
                  Visit website
                </a>
              ) : (
                <p>Website not added</p>
              )}
            </div>

            <div className="mt-5">
              {isVerified ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified Employer
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700">
                  Pending Verification
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-extrabold text-[#2c2935]">
              Profile Completion
            </h3>

            <div className="mt-4">
              <progress
                className="progress progress-warning h-3 w-full"
                value={completionPercent}
                max="100"
              ></progress>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                {completionPercent}% completed
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { label: "Contact name", done: Boolean(name) },
                { label: "Phone", done: Boolean(phone) },
                { label: "Designation", done: Boolean(designation) },
                { label: "Company name", done: Boolean(companyName) },
                { label: "Industry", done: Boolean(industry) },
                { label: "Size", done: Boolean(size) },
                { label: "Website", done: Boolean(website) },
                { label: "Location", done: Boolean(location) },
                { label: "Logo", done: Boolean(logoUrl) },
                { label: "Description", done: Boolean(description) },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-sm font-semibold text-slate-600">
                    {item.label}
                  </span>

                  {item.done ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </form>
  );
}