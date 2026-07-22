"use client";

import Image from "next/image";
import { useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, MapPin, Search } from "lucide-react";

const categories = [
  "Accounting",
  "Bookkeeping",
  "Tax",
  "Audit",
  "Payroll",
  "Financial Analyst",
  "Controller / CFO",
];

const relatedSearchesByCategory: Record<string, string[]> = {
  Accounting: [
    "Remote Accountant",
    "Staff Accountant",
    "Senior Accountant",
    "Accounting Manager",
  ],
  Bookkeeping: [
    "Remote Bookkeeper",
    "QuickBooks Bookkeeper",
    "Xero Bookkeeper",
    "Part-time Bookkeeper",
  ],
  Tax: [
    "Tax Preparer",
    "Remote Tax Associate",
    "CPA Tax Jobs",
    "Tax Reviewer",
  ],
  Audit: [
    "Audit Associate",
    "Remote Audit Jobs",
    "Internal Auditor",
    "Audit Manager",
  ],
  Payroll: [
    "Payroll Specialist",
    "Remote Payroll Jobs",
    "Payroll Accountant",
    "Payroll Manager",
  ],
  "Financial Analyst": [
    "Remote Financial Analyst",
    "FP&A Analyst",
    "Finance Analyst",
    "Budget Analyst",
  ],
  "Controller / CFO": [
    "Remote Controller",
    "Fractional CFO",
    "Assistant Controller",
    "Finance Controller",
  ],
};

const defaultRelatedSearches = [
  "Remote Accountant",
  "Bookkeeping Jobs",
  "Tax Preparation Jobs",
  "Payroll Specialist",
  "QuickBooks Jobs",
  "Work From Home Accounting",
];

export default function HomeHero() {
  const router = useRouter();

  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  const relatedSearches = useMemo(() => {
    if (category && relatedSearchesByCategory[category]) {
      return relatedSearchesByCategory[category];
    }

    if (keyword.trim()) {
      return [
        `${keyword} Remote Jobs`,
        `${keyword} Part-time Jobs`,
        `${keyword} Work From Home`,
        `${keyword} Accounting Jobs`,
      ];
    }

    return defaultRelatedSearches;
  }, [category, keyword]);

  function goToJobs(searchKeyword?: string) {
    const params = new URLSearchParams();

    const finalKeyword = searchKeyword || keyword;

    if (finalKeyword.trim()) {
      params.set("search", finalKeyword.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    if (category.trim()) {
      params.set("category", category.trim());
    }

    const queryString = params.toString();

    router.push(queryString ? `/jobs?${queryString}` : "/jobs");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToJobs();
  }

  return (
    <section className="bg-base-100">
      <div className="grid min-h-[600px] grid-cols-1 px-2 lg:grid-cols-2">
        {/* Left Content */}
        <div className="flex items-center bg-white px-6 py-14 sm:px-8 md:px-10 lg:px-11">
          <div className="w-full max-w-3xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#ff7900]/10 px-4 py-2 text-sm font-bold text-[#ff7900]">
              <BriefcaseBusiness className="h-4 w-4" />
              Remote accounting jobs
            </p>

            <h1 className="text-4xl font-bold leading-tight text-[#1f2327] sm:text-5xl lg:text-[52px]">
              The{" "}
              <span className="text-[#ff7900]">
                #1 Job Site to Find
              </span>{" "}
              Work From Home Jobs.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Discover opportunities in bookkeeping, tax, audit, payroll,
              accounts payable & receivable, and more.{" "}
              <span className="font-semibold text-[#ff7900]">
                Flex-Accountant helps accounting professionals find better jobs
                without ads, scams, or junk listings from trusted employers.
              </span>
            </p>

            {/* Search Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-2xl border border-slate-200 bg-[#f8fafc] p-4 shadow-sm"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center rounded-xl border border-slate-300 bg-white px-4">
                  <Search className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="text"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    placeholder="Job title or keyword"
                    className="h-14 w-full bg-transparent text-base outline-none"
                  />
                </div>

                <div className="flex items-center rounded-xl border border-slate-300 bg-white px-4">
                  <MapPin className="mr-3 h-5 w-5 text-[#ff7900]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Location or remote"
                    className="h-14 w-full bg-transparent text-base outline-none"
                  />
                </div>

                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="select select-bordered h-14 w-full rounded-xl bg-white text-base"
                >
                  <option value="">Select Job Category</option>
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="btn h-14 rounded-xl border-none bg-[#ff7900] text-base font-bold text-white hover:bg-[#e2720f]"
                >
                  <Search className="h-5 w-5" />
                  Search Jobs
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative min-h-[320px] sm:min-h-[380px] lg:min-h-[600px]">
          <Image
            src="/hero-img.jpg"
            alt="Accounting professionals reviewing financial reports"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/5" />

          <div className="absolute left-6 top-6 rounded-tl-2xl rounded-br-2xl bg-white/85 px-5 py-3 text-sm font-semibold text-[#0b5f68] shadow-lg sm:left-10 sm:top-10">
            100% Free Job Search
          </div>

          <div className="absolute bottom-6 right-6 rounded-bl-2xl rounded-tr-2xl bg-[#ff7900] px-5 py-4 text-sm font-bold text-white shadow-lg sm:bottom-10 sm:right-10">
            Remote Jobs Available
          </div>
        </div>
      </div>
    </section>
  );
}