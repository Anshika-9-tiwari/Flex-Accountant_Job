// src/app/(dashboard)/jobseeker/layout.tsx
// import "./globals.css";
import DashboardShell from "@/Components/Dashboard/DashboardShell";

export default function JobseekerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell userType="jobseeker">{children}</DashboardShell>;
}