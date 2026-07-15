// src/app/(dashboard)/jobseeker/profile/page.tsx

"use client";

import { FormEvent, useEffect, useState } from "react";
import FileUploadField from "@/Components/Dashboard/FileUploadField";
import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  ImageIcon,
  Link as LinkIcon,
  ListChecks,
  Loader2,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";

type JobseekerProfileResponse = {
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
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function JobseekerProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");

  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/jobseeker/profile", {
          credentials: "include",
          cache: "no-store",
        });

        const data: JobseekerProfileResponse & { message?: string } =
          await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch profile.");
          return;
        }

        const user = data.user;
        const profile = user.jobseekerProfile;

        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setImage(user.image || "");

        setHeadline(profile?.headline || "");
        setLocation(profile?.location || "");
        setExperience(profile?.experience || "");
        setSkills(profile?.skills?.join(", ") || "");
        setResumeUrl(profile?.resumeUrl || "");
        setBio(profile?.bio || "");
      } catch {
        setError("Something went wrong while loading profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/jobseeker/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          phone,
          image,
          headline,
          location,
          experience,
          skills,
          resumeUrl,
          bio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update profile.");
        return;
      }

      setSuccess("Profile updated successfully.");
    } catch {
      setError("Something went wrong while saving profile.");
    } finally {
      setSaving(false);
    }
  }

  const skillList = skills
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (loading) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading profile...
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
              Jobseeker Profile
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Manage your candidate profile
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Update your accounting experience, resume, location, skills, and
              profile summary.
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
                Save Profile
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
          {/* Personal Info */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <User className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Personal Information
                </h2>
                <p className="text-sm text-slate-500">
                  Basic account and contact details.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Full Name
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <User className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full bg-transparent py-3 outline-none"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  disabled
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
                    className="w-full bg-transparent py-3 outline-none"
                    placeholder="Enter phone number"
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
                    className="w-full bg-transparent py-3 outline-none"
                    placeholder="City, State, Country or Remote"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Uploads */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <ImageIcon className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Uploads
                </h2>
                <p className="text-sm text-slate-500">
                  Upload your profile image and resume.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <FileUploadField
                label="Profile Image"
                uploadUrl="/api/upload/profile-image"
                accept="image/jpeg,image/png,image/webp"
                currentUrl={image}
                buttonText="Upload Profile Image"
                onUploaded={(url) => {
                  setImage(url);
                  setSuccess("Profile image uploaded. Click Save Profile to store it.");
                }}
              />

              <FileUploadField
                label="Resume"
                uploadUrl="/api/upload/resume"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                currentUrl={resumeUrl}
                buttonText="Upload Resume"
                onUploaded={(url) => {
                  setResumeUrl(url);
                  setSuccess("Resume uploaded. Click Save Profile to store it.");
                }}
              />
            </div>
          </div>

          {/* Professional Info */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
                <BriefcaseBusiness className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Professional Details
                </h2>
                <p className="text-sm text-slate-500">
                  Add experience and candidate headline.
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Profile Headline
                </label>

                <input
                  type="text"
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  placeholder="Example: Senior Accountant with 5+ years experience"
                  className="input input-bordered h-13 w-full rounded-xl bg-white"
                />
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
                  <option value="">Select experience</option>
                  <option>Entry Level</option>
                  <option>1 - 3 Years</option>
                  <option>3 - 5 Years</option>
                  <option>5 - 8 Years</option>
                  <option>8+ Years</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Resume URL
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <LinkIcon className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="text"
                    value={resumeUrl}
                    onChange={(event) => setResumeUrl(event.target.value)}
                    placeholder="/uploads/resumes/resume.pdf or external URL"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  You can upload a resume above, or paste an external resume
                  link here.
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <ListChecks className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Skills
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
              placeholder="QuickBooks, Xero, Excel, Payroll, Tax Preparation"
              className="input input-bordered h-13 w-full rounded-xl bg-white"
            />

            <div className="mt-4 flex flex-wrap gap-2">
              {(skillList.length > 0
                ? skillList
                : ["QuickBooks", "Excel", "Bookkeeping"]
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

          {/* Bio */}
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
                <FileText className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Profile Summary
                </h2>
                <p className="text-sm text-slate-500">
                  Short bio visible to employers.
                </p>
              </div>
            </div>

            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Write a short professional summary..."
              className="textarea textarea-bordered min-h-40 w-full rounded-xl bg-white"
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
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {image ? (
              <img
                src={image}
                alt={name || "Profile image"}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0b5f68] text-2xl font-extrabold text-white">
                {name ? getInitials(name) : "JS"}
              </div>
            )}

            <h3 className="mt-5 text-xl font-extrabold text-[#2c2935]">
              {name || "Jobseeker Name"}
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {headline || "Accounting Candidate"}
            </p>

            <div className="mt-5 space-y-3 text-sm font-semibold text-slate-500">
              <p>{email}</p>
              <p>{location || "Location not added"}</p>
              <p>{experience || "Experience not added"}</p>
            </div>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn mt-5 w-full border border-[#ff7900] bg-white text-[#ff7900] hover:bg-[#ff7900] hover:text-white"
              >
                <FileText className="h-5 w-5" />
                View Resume
              </a>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl font-extrabold text-[#2c2935]">
              Profile Completion
            </h3>

            <div className="mt-5 space-y-4">
              {[
                { label: "Basic info", done: Boolean(name && phone) },
                { label: "Profile image", done: Boolean(image) },
                { label: "Headline", done: Boolean(headline) },
                { label: "Location", done: Boolean(location) },
                { label: "Experience", done: Boolean(experience) },
                { label: "Skills", done: skillList.length > 0 },
                { label: "Resume", done: Boolean(resumeUrl) },
                { label: "Bio", done: Boolean(bio) },
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