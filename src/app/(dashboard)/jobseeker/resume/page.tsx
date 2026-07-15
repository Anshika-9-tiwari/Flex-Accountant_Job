// src/app/(dashboard)/jobseeker/resume/page.tsx

"use client";

import { FormEvent, useEffect, useState } from "react";
import FileUploadField from "@/Components/Dashboard/FileUploadField";
import {
  CheckCircle2,
  Download,
  FileText,
  Link as LinkIcon,
  Loader2,
  Save,
  UploadCloud,
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

export default function JobseekerResumePage() {
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
          setError(data.message || "Failed to fetch resume profile.");
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
        setError("Something went wrong while loading resume.");
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
        setError(data.message || "Failed to save resume.");
        return;
      }

      setSuccess("Resume saved successfully.");
    } catch {
      setError("Something went wrong while saving resume.");
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
            Loading resume...
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
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Resume
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Manage your resume
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-[16px]">
              Upload a PDF, DOC, or DOCX resume. Employers will be able to view
              this resume when reviewing your applications.
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
                Save Resume
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
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <UploadCloud className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Upload Resume
                </h2>
                <p className="text-sm text-slate-500">
                  Accepted formats: PDF, DOC, DOCX. Maximum size: 5MB.
                </p>
              </div>
            </div>

            <FileUploadField
              label="Resume File"
              uploadUrl="/api/upload/resume"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              currentUrl={resumeUrl}
              buttonText="Upload Resume"
              onUploaded={(url) => {
                setResumeUrl(url);
                setSuccess("Resume uploaded. Click Save Resume to store it.");
              }}
            />
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
                <LinkIcon className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Resume URL
                </h2>
                <p className="text-sm text-slate-500">
                  Uploaded file path appears here. You can also paste an
                  external resume link.
                </p>
              </div>
            </div>

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

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn mt-5 border border-[#ff7900] bg-white text-[#ff7900] hover:bg-[#ff7900] hover:text-white"
              >
                <Download className="h-5 w-5" />
                View Current Resume
              </a>
            )}
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
                  Save Resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0b5f68] text-white">
              <FileText className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold text-[#2c2935]">
              Resume Status
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-600">
                  Resume uploaded
                </span>

                {resumeUrl ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                )}
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-600">
                  Candidate profile
                </span>

                {name ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                )}
              </div>
            </div>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="btn mt-6 w-full border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
              >
                <FileText className="h-5 w-5" />
                Open Resume
              </a>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              {image ? (
                <img
                  src={image}
                  alt={name || "Profile image"}
                  className="h-14 w-14 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b5f68] text-sm font-extrabold text-white">
                  <User className="h-6 w-6" />
                </div>
              )}

              <div className="min-w-0">
                <h3 className="truncate text-lg font-extrabold text-[#2c2935]">
                  {name || "Jobseeker"}
                </h3>
                <p className="truncate text-sm font-semibold text-slate-500">
                  {email}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-slate-500">
              Keep your resume updated before applying to jobs. Employers will
              use it to review your accounting experience and skills.
            </p>
          </div>
        </aside>
      </section>
    </form>
  );
}