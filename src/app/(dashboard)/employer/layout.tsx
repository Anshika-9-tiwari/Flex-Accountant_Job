import DashboardShell from "@/Components/Dashboard/DashboardShell";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell userType="employer">{children}</DashboardShell>;
}