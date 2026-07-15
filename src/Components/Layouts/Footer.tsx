"use client"

import { Search } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  {
    lable : "Home",
    href : "/"
  },
  {
    lable : "How Flex-Accountant Works",
    href : "/how-flexaccountant-works"
  },
  {
    lable : "Jobs",
    href : "/jobs"
  },
  {
    lable : "Pricing",
    href : "/pricing"
  },
  {
    lable : "Contact",
    href : "/contact"
  }
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-base-300">
      <div className="max-w-7xl mx-auto px-8 pt-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          
          {/* Column 1: Logo + Paragraph */}
          <div>
              <Link href="/" className="flex items-center  mb-4 text-4xl md:text-[44px] font-bold tracking-tight">
                <span className="text-[#ff7900] ">flex</span>
                <span className="text-[#0a6e79]">-accountant</span>
            </Link>

            <p className="text-gray-100 max-w-md leading-relaxed tracking-wide text-[16px]">
              Flex-Accountant connects businesses with skilled accounting
              professionals for bookkeeping, tax, payroll, audit, and finance
              roles. We make hiring accounting talent simple, flexible, and
              efficient.
            </p>
          </div>

          {/* quick links */}
          <div className="md:justify-self-end w-full md:max-w-md text-white mb-5">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

            <ul className="space-y-3 mb-6">
              {footerLinks.map((item)=>(
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-gray-100 hover:text-[#ff7900]/80 transition"
                  >
                    {item.lable}
                  </Link>
                </li>
              ))}
            </ul>

            <form className="join w-full">
              <input
                type="text"
                placeholder="Search jobs by keywords, title, etc"
                className="input input-bordered join-item w-full text-orange-500 "
              />
              <button type="submit" className="btn bg-[#ff7900] join-item">
                <Search className="h-5 w-5 text-[#ffff]" />
              </button>
            </form>
          </div>
        </div>

        <div className="divider border-t-2 border-white/15 my-3"></div>

        <div className="flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Flex Accountant. All rights reserved.</p>

          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-[#ff7900]/80">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#ff7900]/80">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}