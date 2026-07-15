"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  FilePlus2,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";

type DashboardSidebarProps = {
  userType: "jobseeker" | "employer" | "admin";
  mobileOpen: boolean;
  desktopOpen: boolean;
  onCloseMobile: () => void;
};

type SidebarUser = {
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

const jobseekerLinks = [
  {
    label: "Dashboard",
    href: "/jobseeker/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    href: "/jobseeker/profile",
    icon: User,
  },
  {
    label: "Resume",
    href: "/jobseeker/resume",
    icon: FileText,
  },
  {
    label: "Applications",
    href: "/jobseeker/applications",
    icon: BriefcaseBusiness,
  },
  {
    label: "Saved Jobs",
    href: "/jobseeker/saved-jobs",
    icon: Bookmark,
  },
  {
    label: "Job Alerts",
    href: "/jobseeker/job-alerts",
    icon: Bell,
  },
  {
    label: "Messages",
    href: "/jobseeker/messages",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/jobseeker/settings",
    icon: Settings,
  },
];

const employerLinks = [
  {
    label: "Dashboard",
    href: "/employer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Company Profile",
    href: "/employer/company",
    icon: Building2,
  },
  {
    label: "Manage Jobs",
    href: "/employer/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Post New Job",
    href: "/employer/jobs/new",
    icon: FilePlus2,
  },
  {
    label: "Applicants",
    href: "/employer/applicants",
    icon: Users,
  },
  {
    label: "Jobseekers",
    href: "/employer/jobseekers",
    icon: User,
  },
  {
    label: "Messages",
    href: "/employer/messages",
    icon: MessageSquare,
  },
  {
    label: "Billing",
    href: "/employer/billing",
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: "/employer/settings",
    icon: Settings,
  },
];

const adminLinks = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Employers",
    href: "/admin/employers",
    icon: Building2,
  },
  {
    label: "Approvals",
    href: "/admin/approvals",
    icon: ShieldCheck,
  },
  {
    label: "Jobs",
    href: "/admin/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: FileText,
  },
  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    label: "Billing",
    href: "/admin/billing",
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

function getInitials(value: string) {
  return value
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardSidebar({
  userType,
  mobileOpen,
  desktopOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<SidebarUser | null>(null);

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

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/login");
    router.refresh();
  }

  const links =
    userType === "jobseeker"
      ? jobseekerLinks
      : userType === "employer"
      ? employerLinks
      : adminLinks;

  const fallbackName =
    userType === "jobseeker"
      ? "Job Seeker"
      : userType === "employer"
      ? "Employer"
      : "Admin";

  const fallbackInitial =
    userType === "jobseeker" ? "JS" : userType === "employer" ? "EM" : "AD";

  const employerCompany = user?.employerProfile?.company;

  const displayName =
    userType === "employer"
      ? employerCompany?.name || user?.name || fallbackName
      : user?.name || fallbackName;

  const displayImage =
    userType === "employer"
      ? employerCompany?.logoUrl || user?.image || null
      : user?.image || null;

  const displayInitial = displayName ? getInitials(displayName) : fallbackInitial;

  const memberLabel =
    userType === "employer"
      ? user?.employerProfile?.isVerified
        ? "Verified Employer"
        : "Free Employer"
      : userType === "jobseeker"
      ? "Free Member"
      : "Platform Admin";

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 bg-[#0b5f68] text-white shadow-2xl transition-all duration-300
      ${desktopOpen ? "lg:w-[280px]" : "lg:w-[95px]"}
      ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
      w-[280px] lg:translate-x-0`}
    >
      <div className="flex h-full flex-col space-y-4">
        {/* User Box */}
        <div className="flex justify-between border-b border-white/20 px-5 py-6">
          <div className="flex min-w-0 items-center gap-3">
            {displayImage ? (
              <img
                src={displayImage}
                alt={displayName}
                className="h-11 w-11 shrink-0 rounded-full border border-white/20 object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff7900] text-sm font-bold text-white">
                {displayInitial}
              </div>
            )}

            <div
              className={`min-w-0 ${
                desktopOpen ? "lg:block" : "lg:hidden"
              }`}
            >
              <h3 className="truncate font-bold text-white">{displayName}</h3>
              <p className="truncate text-sm text-white/70">{memberLabel}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-2 text-white hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
          {links.map((link) => {
            const Icon = link.icon;

            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                title={!desktopOpen ? link.label : undefined}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-[#ff7900] text-white shadow-lg"
                    : "text-white/90 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />

                <span
                  className={`truncate ${
                    desktopOpen ? "lg:inline" : "lg:hidden"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            title={!desktopOpen ? "Logout" : undefined}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white/80 shadow-sm transition hover:bg-[#ff7900] hover:text-white"
          >
            <LogOut className="h-5 w-5 shrink-0" />

            <span
              className={`truncate ${desktopOpen ? "lg:inline" : "lg:hidden"}`}
            >
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}