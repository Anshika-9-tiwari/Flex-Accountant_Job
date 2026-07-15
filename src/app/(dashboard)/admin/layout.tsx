import DashboardShell from "@/Components/Dashboard/DashboardShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell userType="admin">{children}</DashboardShell>;
}