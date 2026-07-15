"use client"
import Image from "next/image";
import { Search } from "lucide-react";

export default function HomeHero() {
  return (
    <section className="bg-base-100">
      <div className="grid min-h-[620px] grid-cols-1 lg:grid-cols-2 px-2">
        {/* Left Content */}
        <div className="flex items-center bg-white px-6 py-16 sm:px-10 md:px-12 lg:px-14 xl:px-16">
          <div className="w-full max-w-2xl">
            <h1 className="text-4xl font-bold leading-tight text-[#1f2327] sm:text-5xl lg:text-[52px]">
              The{" "} <span className="text-[#ff7900]">#1 Job Site to Find</span> Work From Home Jobs.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Discover opportunities in bookkeeping, tax, audit, payroll,
              accounts payable & receivable, and more. <span className="text-[#ff7900]">"Flex-Accountant helps accounting professionals to find better jobs without ads, scams, or junk listings from trusted employers".</span>
            </p>

            {/* Search Form */}
            <form className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Job title or keyword"
                className="input input-bordered h-14 w-full rounded-md bg-white text-base"
              />

              <input
                type="text"
                placeholder="Location or remote"
                className="input input-bordered h-14 w-full rounded-md bg-white text-base"
              />

              <select
                defaultValue=""
                className="select select-bordered h-14 w-full rounded-md bg-white text-base"
              >
                <option value="" disabled>
                  Select Job Category
                </option>
                <option>Accounting</option>
                <option>Bookkeeping</option>
                <option>Tax</option>
                <option>Audit</option>
                <option>Payroll</option>
                <option>Financial Analyst</option>
                <option>Controller / CFO</option>
              </select>

              <button
                type="submit"
                className="btn h-14 rounded-md border-none bg-[#ff7900] text-base font-bold text-white hover:bg-[#e2720f]"
              >
                <Search className="h-5 w-5" />
                Search Jobs
              </button>
            </form>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-[620px] ">
          <Image
            src="/hero-img.jpg"
            alt="Accounting professionals reviewing financial reports"
            fill
            priority
            className="object-cover"
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-black/5" />

          {/* Floating Badge 1 */}
          <div className="absolute left-6 top-6 rounded-tl-2xl rounded-br-2xl bg-white/85 px-5 py-3 text-sm font-semibold text-[#0b5f68] shadow-lg sm:left-10 sm:top-10">
            100% Free Job Search
          </div>

          {/* Floating Badge 2 */} 
          <div className="absolute bottom-6 right-6 rounded-bl-2xl rounded-tr-2xl bg-[#ff7900] px-5 py-4 text-sm font-bold text-white shadow-lg sm:bottom-10 sm:right-10">
            Remote Jobs Available
          </div>
        </div>
      </div>
    </section>
  );
}