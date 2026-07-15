// app/pricing/page.tsx
"use client"

import Link from "next/link";
import {
  BadgeCheck,
  CheckCircle2,
} from "lucide-react";

export default function PricingHighlights() {
  return (
    <main className="bg-base-100 text-base-content">
      {/* Pricing Highlight */}
      <section className="bg-base-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#144e75] via-[#073947] to-[#023028] p-8 text-white sm:p-10 lg:p-14">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <p className="mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
                  Simple Pricing for Employer
                </p>

                <h2 className="text-3xl font-extrabold sm:text-4xl">
                  No hidden charges. No subscription fee.
                </h2>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
                  Flex-Accountant currently offers all employer services free.
                  This includes job search, profile setup, resume upload, and
                  job applications.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 text-[#242c36] shadow-lg sm:p-8">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="h-8 w-8 text-[#ff7900]" />
                  <h3 className="text-2xl font-bold">Free Membership for Employer</h3>
                </div>

                <div className="mt-6 border-t border-base-300 pt-6">
                  <p className="text-5xl font-extrabold text-[#ff7900]">$0</p>
                  <p className="mt-2 text-slate-600">
                    Available now for all employers & job seekers 
                  </p>

                  <ul className="mt-6 space-y-3 text-sm sm:text-base">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#ff7900]" />
                      Unlimited job browsing
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#ff7900]" />
                      Free applications
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#ff7900]" />
                      Resume upload and profile creation
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#ff7900]" />
                      Access to flexible and remote jobs
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#ff7900]" />
                      Access to resume database for employer
                    </li>
                  </ul>

                  <Link
                    href="/employer/register"
                    className="btn mt-6 w-full border-none bg-[#ff7900] px-8 text-white hover:bg-[#dd6b08]"
                  >
                    Join for Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fff4ed]">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-[#292d33] sm:text-4xl">
            Ready to find your next accounting job?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
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