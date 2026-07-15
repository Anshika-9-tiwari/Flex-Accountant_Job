"use client"
import Link from "next/link";

const categories = [
  "Forensic Accounting",
  "Cost Accounting",
  "Public Accounting",
  "Accounts Receivable",
  "Accounts Payable",
  "Financial Analyst",
  "Accounting Manager",
  "Corporate Accounting",
  "Accounting",
  "Bookkeeping",
  "Controller",
  "Tax",
  "Audit",
  "Payroll",
  "CFO",
  "Billing", 
];

export default function AccountingCategoriesSection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-18 sm:px-4 lg:px-6">
        <div className="overflow-hidden rounded-3xl shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column */}
            <div className="bg-[#f0f0f0] px-6 py-12 sm:px-8 lg:px-10">
              <div className="max-w-xl">
                <p className="mb-6 inline-block rounded-full bg-[#ff7900]/10 px-4 py-2 text-sm font-semibold text-[#ff7900]">
                  Explore Categories
                </p>

                <h2 className="text-3xl font-bold leading-snug text-gray-700 sm:text-4xl lg:text-5xl">
                  Find Jobs Across Top{" "}
                  <span className="text-[#ff7900]">Accounting Categories</span>
                </h2>

                <p className="mt-10 text-medium leading-8 text-slate-600 sm:text-[17px]">
                  Browse roles in bookkeeping, tax, audit, payroll, accounts
                  receivable, accounts payable, corporate accounting, public
                  accounting, and more. Whether you are looking for entry-level,
                  mid-level, or senior finance opportunities, our platform makes
                  it easy to explore the right category for your career goals.
                </p>

                <p className="mt-10 text-[17px] font-medium leading-7 text-[#ff7900]">
                  Flex-Accountant helps candidates discover accounting and finance opportunities across specialized career paths. 
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/jobs"
                    className="btn border-none bg-[#ff7900] px-8 text-white hover:bg-[#e77816]"
                  >
                    Browse Jobs
                  </Link>

                  <Link
                    href="/jobseeker/register"
                    className="btn border border-[#0b5f68] bg-white px-8 text-[#0b5f68] hover:bg-[#0b5f68] hover:text-white"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="bg-[#ff7900] px-6 py-12 text-white sm:px-10 lg:px-12">
              <div className="mb-6">
                <h3 className="text-2xl font-bold sm:text-[42px]">
                  Accounting Categories
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-white/90">
                  Explore high-demand accounting and finance job categories on
                  Flex-Accountant.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-white/50 bg-white/95 px-4 py-2 text-sm font-medium text-[#0d4f57] shadow-sm transition duration-300 hover:scale-105 hover:bg-[#ff7900] hover:text-white"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="mt-10 rounded-2xl border border-white/40 bg-white/10 p-5 backdrop-blur-sm">
                <h4 className="text-xl font-bold">Why choose Flex-Accountant?</h4>
                <p className="mt-3 text-white/90 leading-7">
                  We focus on accounting and finance roles so job seekers can quickly find relevant openings in specialized categories without unnecessary clutter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}