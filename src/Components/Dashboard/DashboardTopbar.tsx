// src/Components/Dashboard/DashboardTopbar.tsx

"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
} from "lucide-react";

type DashboardTopbarProps = {
  userType: "jobseeker" | "employer" | "admin";
  desktopSidebarOpen: boolean;
  onOpenMobileSidebar: () => void;
  onToggleDesktopSidebar: () => void;
};

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "JOBSEEKER" | "EMPLOYER" | "ADMIN";
  employerProfile?: {
    designation: string | null;
    isVerified: boolean;
    company: {
      id: string;
      name: string;
      logoUrl: string | null;
    } | null;
  } | null;
};

function getInitials(value: string) {
  return value
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardTopbar({
  userType,
  desktopSidebarOpen,
  onOpenMobileSidebar,
  onToggleDesktopSidebar,
}: DashboardTopbarProps) {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
        }
      } catch {
        setUser(null);
      }
    }

    fetchCurrentUser();
  }, []);

  const title =
    userType === "jobseeker"
      ? "Jobseeker Dashboard"
      : userType === "employer"
      ? "Employer Dashboard"
      : "Admin Dashboard";

  const fallbackName =
    userType === "jobseeker"
      ? "Job Seeker"
      : userType === "employer"
      ? "Employer"
      : "Admin";

  const employerCompany = user?.employerProfile?.company;

  const displayName =
    userType === "employer"
      ? employerCompany?.name || user?.name || fallbackName
      : user?.name || fallbackName;

  const displaySubText =
    userType === "employer"
      ? user?.employerProfile?.isVerified
        ? "Verified Employer"
        : "Employer Account"
      : userType === "jobseeker"
      ? "Jobseeker Account"
      : "Platform Admin";

  const displayImage =
    userType === "employer"
      ? employerCompany?.logoUrl || user?.image || null
      : user?.image || null;

  const displayInitials = getInitials(displayName);

  const actionHref =
    userType === "employer"
      ? "/employer/jobs/new"
      : userType === "admin"
      ? "/admin/approvals"
      : "/jobs";

  const actionLabel =
    userType === "employer"
      ? "Post Job"
      : userType === "admin"
      ? "Approvals"
      : "Find Jobs";

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = search.trim();

    if (!query) return;

    if (userType === "employer") {
      router.push(`/employer/candidates?search=${encodeURIComponent(query)}`);
      return;
    }

    if (userType === "admin") {
      router.push(`/admin/users?search=${encodeURIComponent(query)}`);
      return;
    }

    router.push(`/jobs?search=${encodeURIComponent(query)}`);
  }

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex h-full items-center justify-between gap-4 px-2 py-3 sm:px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Mobile sidebar button */}
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-[#0b5f68] hover:bg-slate-100 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Desktop collapse button */}
          <button
            type="button"
            onClick={onToggleDesktopSidebar}
            className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#ff7900]/10 text-[#0b5f68] hover:bg-slate-100 lg:flex"
            aria-label="Toggle sidebar"
          >
            {desktopSidebarOpen ? (
              <ChevronLeft className="h-6 w-6 text-orange-400" />
            ) : (
              <ChevronRight className="h-6 w-6" />
            )}
          </button>

          <div>
            <Link href="/" className="text-xl font-extrabold sm:text-2xl">
              <span className="text-[#ff7900]">flex</span>
              <span className="text-[#0b5f68]">-accountant</span>
            </Link>

            <p className="hidden text-sm font-semibold text-slate-500 sm:block">
              {title}
            </p>
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden w-full max-w-md items-center rounded-xl border border-slate-300 bg-white px-4 py-3 md:flex"
        >
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={
              userType === "employer"
                ? "Search candidates..."
                : userType === "admin"
                ? "Search users..."
                : "Search jobs..."
            }
            className="w-full bg-transparent text-sm outline-none"
          />

          <button type="submit" aria-label="Search">
            <Search className="h-5 w-5 text-[#ff7900]" />
          </button>
        </form>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">

          <Link
            href={
              userType === "employer"
                ? "/employer/company"
                : userType === "admin"
                ? "/admin/settings"
                : "/jobseeker/profile"
            }
            className="flex items-center gap-3 rounded-2xl px-2 py-1.5 hover:bg-slate-100"
          >
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayName}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b5f68] text-sm font-extrabold text-white">
                {displayInitials}
              </div>
            )}

            <div className="hidden max-w-[170px] text-left lg:block">
              <p className="truncate text-sm font-extrabold text-[#2c2935]">
                {displayName}
              </p>

              <p className="truncate text-xs font-semibold text-slate-500">
                {displaySubText}
              </p>
            </div>
          </Link>

          <Link
            href={actionHref}
            className="hidden rounded-xl bg-[#ff7900] px-5 py-3 text-sm font-bold text-white hover:bg-[#e86e00] lg:inline-flex"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}