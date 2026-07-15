"use client";

import Link from "next/link";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  
  {
    label: "How Flex-Accountant Works",
    href: "/how-flexaccountant-works",
  },
  {
    label: "Jobs",
    href: "/jobs",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

const authButtons = [
  {
    label: "Log In",
    buttonClass:
      "bg-[#ff7900] text-white hover:bg-[#e86e00]",
    items: [
      {
        label: "Job Seeker Login",
        href: "/login?role=jobseeker",
      },
      {
        label: "Employer Login",
        href: "/login?role=employer",
      },
    ],
  },
  {
    label: "Register",
    buttonClass:
      "bg-base-100 text-neutral hover:bg-gray-100",
    items: [
      {
        label: "Job Seeker Register",
        href: "/jobseeker/register",
      },
      {
        label: "Employer Register",
        href: "/employer/register",
      },
    ],
  },
];

export default function MarketingHeader() {
  const [open, setOpen] = useState(false);
  const [mobileAuthOpen, setMobileAuthOpen] = useState<string | null>(null);

  const closeMobileMenu = () => {
    setOpen(false);
    setMobileAuthOpen(null);
  };

  const desktopLinkClass =
    "relative inline-flex items-center transition-all duration-300 hover:scale-105 hover:text-[#ff7900] after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-[#ff7900] after:transition-transform after:duration-300 hover:after:scale-x-100";

  const mobileLinkClass =
    "relative rounded-lg px-2 py-2 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:text-[#ff7900] after:absolute after:bottom-0 after:left-2 after:h-[2px] after:w-[calc(100%-1rem)] after:origin-center after:scale-x-0 after:bg-[#ff7900] after:transition-transform after:duration-300 hover:after:scale-x-100";

  const buttonHoverClass =
    "transition-all duration-300 hover:scale-105 active:scale-95";

  return (
    <header className="sticky top-0 z-50 bg-base-100 mb-1">
      {/* Top Header */}
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-2xl font-bold leading-none tracking-tight transition-transform duration-300 hover:scale-105 sm:text-3xl lg:text-4xl"
          >
            <span className="text-[#ff7900]">flex</span>
            <span className="text-[#0b5f68]">-accountant</span>
          </Link>

          {/* Tagline */}
          <p className="hidden whitespace-nowrap text-lg font-medium tracking-wide text-[#0b5f68] italic xl:block">
            Find A <span className="text-[#ff7900]">Better</span> Way to Work
          </p>

          {/* Search */}
          <form className="hidden w-full max-w-xs items-center rounded-xl border border-[#ff7900]/80 bg-base-100 px-4 py-2 transition-all duration-300 focus-within:border-[#ff7900] focus-within:shadow-md md:flex lg:max-w-sm">
            <input
              type="text"
              placeholder="Search by keyword, title, etc"
              className="w-full bg-transparent text-sm outline-none lg:text-base"
            />
            <button type="submit" className="cursor-pointer">
              <Search className="h-5 w-5 text-[#ff7900]" />
            </button>
          </form>

          {/* Mobile Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="btn btn-ghost transition-transform duration-300 hover:scale-110 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <X className="h-7 w-7 text-[#0b5f68]" />
            ) : (
              <Menu className="h-7 w-7 text-[#0b5f68]" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden bg-[#0b5f68] lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-2">
          {/* Left Column Links */}
          <div className="flex items-center gap-8 text-[16px] text-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={desktopLinkClass}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Column Auth Dropdown Buttons */}
          <div className="flex items-center gap-5">
            {authButtons.map((auth) => (
              <div key={auth.label} className="group relative">
                <button
                  type="button"
                  className={`btn border-none px-9 text-[14px] ${auth.buttonClass} ${buttonHoverClass}`}
                >
                  {auth.label}
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>

                <div className="invisible absolute right-0 top-full z-50 mt-3 w-60 translate-y-2 rounded-xl border border-gray-100 bg-white p-3 opacity-0 shadow-xl transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="space-y-2">
                    {auth.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-lg px-4 py-3 text-sm font-semibold text-[#0b5f68] transition-all duration-300 hover:scale-[1.02] hover:bg-[#ff7900]/10 hover:text-[#ff7900]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile / Tablet Navigation */}
      {open && (
        <nav className="bg-[#0a5158] px-4 py-5 sm:px-6 lg:hidden">
          <div className="mx-auto max-w-7xl space-y-5">
            {/* Mobile Search */}
            <form className="flex w-full items-center rounded-xl border border-[#ff7900]/70 bg-white px-4 py-3 md:hidden">
              <input
                type="text"
                placeholder="Search by keyword, title, etc"
                className="w-full bg-transparent text-sm text-neutral outline-none"
              />
              <button type="submit">
                <Search className="h-5 w-5 text-[#ff7900]" />
              </button>
            </form>

            {/* Mobile Links */}
            <div className="flex flex-col gap-2 text-base text-white sm:text-lg">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={mobileLinkClass}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Dropdowns */}
            <div className="space-y-3 pt-2">
              {authButtons.map((auth) => (
                <div key={auth.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setMobileAuthOpen(
                        mobileAuthOpen === auth.label ? null : auth.label
                      )
                    }
                    className={`btn w-full border-none ${auth.buttonClass} ${buttonHoverClass}`}
                  >
                    {auth.label} 
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        mobileAuthOpen === auth.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileAuthOpen === auth.label && (
                    <div className="mt-2 grid grid-cols-1 gap-3 rounded-xl bg-white/10 p-3 sm:grid-cols-2">
                      {auth.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="btn w-full border-none bg-white text-[#0b5f68] transition-all duration-300 hover:scale-105 hover:bg-[#ff7900] hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Orange Line */}
      <div className="mx-auto mt-0.5  h-1 max-w-7xl bg-[#ff7900]" />
    </header>
  );
}