// src/app/employer/register/page.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  Building2,
  Globe,
  Loader2,
  Lock,
  Mail,
  MapPin,
  User,
} from "lucide-react";

export default function EmployerRegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register/employer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          companyName,
          designation,
          industry,
          website,
          location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Employer registration failed.");
        return;
      }

      router.push(data.redirectTo || "/employer/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-10">
      <section className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        {/* Left */}
        <div className="bg-gradient-to-br from-[#0b5f68] to-[#083f46] p-8 text-white sm:p-12">
          <Link href="/" className="text-3xl font-extrabold">
            <span className="text-[#ff7900]">flex</span>
            <span className="text-white">-accountant</span>
          </Link>

          <div className="mt-20">
            <p className="mb-6 inline-flex rounded-full bg-white/10 px-6 py-2 text-sm font-semibold">
              Employer Registration
            </p>

            <h1 className="text-4xl font-extrabold leading-tight">
              Create your employer account
            </h1>

            <p className="mt-6 max-w-md leading-7 text-white/95">
              Post accounting jobs, manage applicants, review candidates, and
              build your company hiring profile. 
              <span className="block mt-2 text-white/85">Flex Accountant is the best platform for accounting employers to find the best talent and streamline their hiring process.</span>
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="p-6 sm:p-10">
          <div className="mx-auto max-w-xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ff7900]/10 text-[#ff7900]">
                <Building2 className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-extrabold text-[#2c2935]">
                Register as Employer
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your free employer account.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
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
                    placeholder="Enter your name"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <Mail className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter email"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div>
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
                    placeholder="Company name"
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
                  placeholder="HR Manager"
                  className="input input-bordered h-13 w-full rounded-xl bg-white"
                />
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
                  {["Accounting","Bookkeeping","Tax","Audit","Payroll","Accounts Receivable","Accounts Payable","Financial Analyst","Controller / CFO","Accounting Manager","Billing","Forensic Accounting","Cost Accounting","Public Accounting","Corporate Accounting",].map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
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

              <div className="sm:col-span-2">
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Password
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <Lock className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2c2935]">
                  Confirm Password
                </label>

                <div className="flex items-center rounded-xl border border-base-300 bg-white px-4">
                  <Lock className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm password"
                    className="w-full bg-transparent py-3 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn col-span-full w-full border-none bg-[#ff7900] text-white hover:bg-[#e86e00]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Employer Account"
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login?role=employer"
                className="font-bold text-[#ff7900] hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}