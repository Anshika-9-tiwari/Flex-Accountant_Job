// src/Components/Dashboard/DashboardShell.tsx

"use client";

import { useState } from "react";
import DashboardSidebar from "@/Components/Dashboard/DashboardSidebar";
import DashboardTopbar from "@/Components/Dashboard/DashboardTopbar";

type DashboardShellProps = {
  children: React.ReactNode;
  userType: "jobseeker" | "employer" | "admin";
};

export default function DashboardShell({
  children,
  userType,
}: DashboardShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb] overflow-y-hidden">
      <DashboardSidebar
        userType={userType}
        mobileOpen={mobileSidebarOpen}
        desktopOpen={desktopSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {mobileSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div
        className={`min-h-screen transition-all duration-300 ${
          desktopSidebarOpen ? "lg:ml-[280px]" : "lg:ml-[95px]"
        }`}
      >
        <DashboardTopbar
          userType={userType}
          desktopSidebarOpen={desktopSidebarOpen}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onToggleDesktopSidebar={() =>
            setDesktopSidebarOpen((current) => !current)
          }
        />

        <main className="px-3 py-6 sm:px-4 lg:px-6">{children}</main>
      </div>
    </div>
  );
}