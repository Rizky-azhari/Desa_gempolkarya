import { UserRole } from "@/lib/roles";

export type UserStatus = "Aktif" | "Nonaktif";

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  fixed?: boolean;
  createdAt: string;
}

// Static default users (removed operator_layanan and operator_pengaduan)
export const defaultUsers: DashboardUser[] = [
  {
    id: "1",
    name: "Super Admin Desa",
    email: "superadmin@desa.go.id",
    password: "SuperAdmin123",
    role: "super_admin",
    status: "Aktif",
    fixed: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Admin Desa",
    email: "admin@desa.go.id",
    password: "Admin123",
    role: "admin_desa",
    status: "Aktif",
    fixed: false,
    createdAt: "2026-01-02T00:00:00.000Z",
  },
];
