export type UserRole =
  | "super_admin"
  | "admin_desa"
  | "kepala_desa"
  | "sekretaris_desa";

export const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin_desa: "Admin Desa",
  kepala_desa: "Kepala Desa",
  sekretaris_desa: "Sekretaris Desa",
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
    "layanan",
    "berita",
    "umkm",
    "galeri",
    "pengaduan",
  ],

  kepala_desa: [
    "dashboard",
    "data-desa",
    "layanan",
    "pengaduan",
    "rt-rw",
    "umkm",
    "berita",
  ],

  sekretaris_desa: [
    "dashboard",
    "data-desa",
    "layanan",
    "perangkat-desa",
    "rt-rw",
  ],
};

export function canAccessMenu(role: UserRole, menuKey: string): boolean {
  return roleMenus[role]?.includes(menuKey) ?? false;
}
