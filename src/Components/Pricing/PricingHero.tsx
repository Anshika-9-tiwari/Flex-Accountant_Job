// app/pricing/page.tsx
"use client"

import Link from "next/link";
import {
  CheckCircle2,
  CircleDollarSign,
  FileText,
  SearchCheck,
  ShieldCheck,
  Users,
} from "lucide-react";

const services = [
  "Browse unlimited accounting and finance jobs",
  "Apply to jobs for free",
  "Create your job seeker profile",
  "Upload and manage your resume",
  "Save jobs and track applications",
  "Access remote, flexible, and work-from-home opportunities",
];

const features = [
  {
    icon: SearchCheck,
    title: "Easy Job Search",
    text: "Search accounting, bookkeeping, tax, audit, payroll, and finance jobs with ease.",
  },
  {
    icon: FileText,
    title: "Resume Management",
    text: "Upload your resume, manage your profile, and apply to jobs quickly.",
  },
  {
    icon: Users,
    title: "Trusted Employers",
    text: "Connect with companies actively hiring accounting professionals.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Reliable",
    text: "A clean and professional platform focused on quality accounting job opportunities.",
  },
];

export default function PricingPage() {
  return (
    <main className="bg-base-100 text-base-content">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#f8f8f8] to-[#fff4ed]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left Content */}
            <div>
              <p className="mb-4 inline-flex items-center rounded-full bg-[#ff7900]/10 px-4 py-2 text-sm font-semibold text-[#ff7900]">
                Flex-Accountant Pricing
              </p>

              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-gray-800 sm:text-5xl lg:text-6xl">
                Find Your Next Accounting Job —{" "}
                <span className="text-[#ff7900]">100% Free</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                At Flex-Accountant, all job seeker services are currently free.
                Search jobs, create your profile, upload your resume, and apply
                to accounting and finance opportunities without paying anything.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/jobs"
                  className="btn border-none bg-[#ff7900] px-8 text-white hover:bg-[#dd6b08]"
                >
                  Explore Jobs
                </Link>

                <Link
                  href="/jobseeker/register"
                  className="btn border border-[#20252b] bg-white px-8 text-[#1f2329] hover:bg-slate-50"
                >
                  Create Free Account
                </Link>
              </div>
            </div>

            {/* Right Pricing Card */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-3xl bg-[#ff7900] p-6 text-white shadow-2xl sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-full bg-white/20 p-3">
                    <CircleDollarSign className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Current Plan</h2>
                    <p className="text-white/90">For all job seekers</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 text-[#1f2429]">
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#ff7900]">
                    Active Offer
                  </p>
                  <h3 className="mt-2 text-4xl font-extrabold">Free</h3>
                  <p className="mt-2 text-slate-600">
                    All job services are currently free for candidates.
                  </p>

                  <ul className="mt-6 space-y-3">
                    {services.map((service) => (
                      <li key={service} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff7900]" />
                        <span className="text-sm sm:text-base">{service}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/jobseeker/register"
                    className="btn mt-6 w-full border-none bg-[#ff7900] text-white hover:bg-[#dd6b08]"
                  >
                    Get Started Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Free Section */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-7xl px-4 py-18 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[#20262c] sm:text-4xl">
              Why Flex-Accountant is Free Right Now
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600">
              We want to make it easier for accounting professionals to find
              flexible, remote, and full-time opportunities without barriers.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex rounded-full bg-[#ff7900]/10 p-3 text-[#ff7900]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0b2d57]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}