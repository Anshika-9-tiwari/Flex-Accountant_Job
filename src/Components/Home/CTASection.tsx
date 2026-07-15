"use client"

import Link from "next/link";

export default function CTASection() {
  return (
    <main className="bg-base-100 text-base-content">
      {/* CTA */}
      <section className="bg-[#fff4ed]">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-[#292d33] sm:text-4xl">
            Ready to find your next accounting job?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Join Flex-Accountant today and explore free job opportunities in
            bookkeeping, tax, payroll, audit, and finance.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/jobseeker/register"
              className="btn border-none bg-[#ff7900] px-8 text-white hover:bg-[#dd6b08]"
            >
              Create Free Account
            </Link>
            <Link
              href="/jobs"
              className="btn border border-[#1b1f24] bg-white px-8 text-[#242a31] hover:bg-slate-50"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}