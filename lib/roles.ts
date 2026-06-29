export type UserRole =
  | "super_admin"
  | "admin_desa";

export const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin_desa: "Admin Desa",
};

export const roleMenus: Record<UserRole, string[]> = {
  super_admin: [
    "dashboard",
    "profil-desa",
    "data-desa",
    "layanan",
    "pengaduan",
    "berita",
    "umkm",
    "galeri",
    "rt-rw",
    "perangkat-desa",
    "pengguna",
    "pengaturan-role",
  ],

  admin_desa: [
    "dashboard",
    "profil-desa",
    "data-desa",
    "layanan",
    "pengaduan",
    "berita",
    "umkm",
    "galeri",
    "rt-rw",
    "perangkat-desa",
  ],
};

export function canAccessMenu(role: UserRole, menuKey: string): boolean {
  return roleMenus[role]?.includes(menuKey) ?? false;
}
