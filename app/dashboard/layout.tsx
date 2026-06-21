import { RoleProvider } from "@/components/dashboard/RoleContext";
import { ProtectedDashboard } from "@/components/auth/ProtectedDashboard";
import DashboardLayoutContent from "./layout-content";

export const metadata = {
  title: "Dashboard Internal Desa Citimun",
  description: "Dashboard tata kelola dan pelayanan administratif internal Desa Citimun.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <ProtectedDashboard>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </ProtectedDashboard>
    </RoleProvider>
  );
}

