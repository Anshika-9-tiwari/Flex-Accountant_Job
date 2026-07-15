// src/Components/Dashboard/SettingsPage.tsx

"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  ImageIcon,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

type UserRole = "JOBSEEKER" | "EMPLOYER" | "ADMIN";

type SettingsUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  jobseekerProfile: {
    headline: string | null;
    location: string | null;
    experience: string | null;
    skills: string[];
    resumeUrl: string | null;
    bio: string | null;
  } | null;
  employerProfile: {
    designation: string | null;
    isVerified: boolean;
    company: {
      id: string;
      name: string;
      industry: string | null;
      website: string | null;
      location: string | null;
    } | null;
  } | null;
};

type SettingsPageProps = {
  userType: "jobseeker" | "employer" | "admin";
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function SettingsPage({ userType }: SettingsPageProps) {
  const [user, setUser] = useState<SettingsUser | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch("/api/settings", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch settings.");
          return;
        }

        const fetchedUser: SettingsUser = data.user;

        setUser(fetchedUser);
        setName(fetchedUser.name || "");
        setEmail(fetchedUser.email || "");
        setPhone(fetchedUser.phone || "");
        setImage(fetchedUser.image || "");
      } catch {
        setError("Something went wrong while loading settings.");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  async function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSavingAccount(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          phone,
          image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update account settings.");
        return;
      }

      setUser(data.user);
      setSuccess("Account settings updated successfully.");
    } catch {
      setError("Something went wrong while updating account settings.");
    } finally {
      setSavingAccount(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setSavingPassword(true);

    try {
      const response = await fetch("/api/settings/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Password updated successfully.");
    } catch {
      setError("Something went wrong while updating password.");
    } finally {
      setSavingPassword(false);
    }
  }

  const title =
    userType === "employer"
      ? "Employer Settings"
      : userType === "admin"
      ? "Admin Settings"
      : "Jobseeker Settings";

  const profileLink =
    userType === "employer"
      ? "/employer/company"
      : userType === "admin"
      ? "/admin/dashboard"
      : "/jobseeker/profile";

  const profileLinkLabel =
    userType === "employer"
      ? "Company Profile"
      : userType === "admin"
      ? "Admin Dashboard"
      : "Candidate Profile";

  if (loading) {
    return (
      <section className="flex min-h-72 items-center justify-center rounded-2xl bg-white shadow-sm">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#ff7900]" />
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Loading settings...
          </p>
        </div>
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
              Settings
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/85 sm:text-lg">
              Update your account details, profile image URL, phone number, and
              password.
            </p>
          </div>

          <Link
            href={profileLink}
            className="btn border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
          >
            <User className="h-5 w-5" />
            {profileLinkLabel}
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

      <section className="grid gap-8 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Account Settings */}
          <form
            onSubmit={handleAccountSubmit}
            className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <User className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Account Information
                </h2>
                <p className="text-sm text-slate-500">
                  Update your basic account details.
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
                    placeholder="Enter name"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-slate-100 px-4">
                  <Mail className="mr-3 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full bg-transparent py-3 text-slate-500 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-400">
                  Email change is disabled for account safety.
                </p>
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
                  Profile Image URL
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <ImageIcon className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="url"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingAccount}
                className="btn border-none bg-[#ff7900] px-8 text-white hover:bg-[#e86e00]"
              >
                {savingAccount ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save Account
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Password Settings */}
          <form
            onSubmit={handlePasswordSubmit}
            className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0b5f68]/10 text-[#0b5f68]">
                <KeyRound className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold text-[#2c2935]">
                  Password & Security
                </h2>
                <p className="text-sm text-slate-500">
                  Change your password using your current password.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Current Password
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <Lock className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                    New Password
                  </label>

                  <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                    <KeyRound className="mr-3 h-5 w-5 text-[#ff7900]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) => setNewPassword(event.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full bg-transparent py-3 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                    Confirm Password
                  </label>

                  <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                    <KeyRound className="mr-3 h-5 w-5 text-[#ff7900]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm new password"
                      className="w-full bg-transparent py-3 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#0b5f68] hover:text-[#ff7900]"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide passwords
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show passwords
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingPassword}
                className="btn border-none bg-[#0b5f68] px-8 text-white hover:bg-[#084a51]"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-20 w-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#0b5f68] text-2xl font-extrabold text-white">
                {name ? getInitials(name) : "US"}
              </div>
            )}

            <h3 className="mt-5 text-xl font-extrabold text-[#2c2935]">
              {name || "User"}
            </h3>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {email}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#0b5f68]/10 px-4 py-2 text-sm font-bold text-[#0b5f68]">
                {user?.role}
              </span>

              {user?.isActive ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
                  Inactive
                </span>
              )}
            </div>

            {user?.createdAt && (
              <p className="mt-5 text-sm font-semibold text-slate-500">
                Joined {formatDate(user.createdAt)}
              </p>
            )}
          </div>

          {userType === "employer" && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#ff7900]">
                <Building2 className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-[#2c2935]">
                Company Status
              </h3>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                {user?.employerProfile?.company?.name || "Company not added"}
              </p>

              <div className="mt-4">
                {user?.employerProfile?.isVerified ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified Employer
                  </span>
                ) : (
                  <span className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700">
                    Pending Verification
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-[#0b5f68] p-6 text-white shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <ShieldCheck className="h-7 w-7 text-[#ff7900]" />
            </div>

            <h3 className="mt-5 text-xl font-extrabold">Security Note</h3>

            <p className="mt-3 text-sm leading-6 text-white/85">
              Use a strong password and avoid sharing your account login. Email
              changes are disabled here to prevent account ownership mistakes.
            </p>
          </div>
        </aside>
      </section>
    </section>
  );
}