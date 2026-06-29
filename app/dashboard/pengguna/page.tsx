"use client";

import React, { useEffect, useState } from "react";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { UserManagementTable } from "@/components/dashboard/UserManagementTable";
import { UserFormDialog } from "@/components/dashboard/UserFormDialog";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { Button } from "@/components/ui/button";
import { Plus, UserCheck, UserX, Users, Shield, History, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { TableRow, TableCell } from "@/components/ui/table";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Logs state
  const [activeTab, setActiveTab] = useState<"daftar" | "riwayat">("daftar");
  const [logs, setLogs] = useState<any[]>([]);
  const [isLogsLoading, setIsLogsLoading] = useState(false);
  const [logsSearch, setLogsSearch] = useState("");

  async function fetchLogs() {
    setIsLogsLoading(true);
    try {
      const { getAuthHeaders } = await import("@/utils/supabase/client");
      const res = await fetch("/api/activity-logs", {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) {
        throw new Error("Gagal memuat riwayat aktivitas.");
      }
      const data = await res.json();
      setLogs(data || []);
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan memuat riwayat.");
    } finally {
      setIsLogsLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "riwayat") {
      fetchLogs();
    }
  }, [activeTab]);

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const { getAuthHeaders } = await import("@/utils/supabase/client");
      const res = await fetch("/api/admin/users", {
        headers: {
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) {
        throw new Error("Gagal memuat daftar pengguna.");
      }
      const data = await res.json();
      setUsers(data || []);
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan memuat data.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengguna "${name}"?`)) {
      try {
        const { getAuthHeaders } = await import("@/utils/supabase/client");
        const res = await fetch(`/api/admin/users/${id}`, {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal menghapus pengguna.");
        }

        toast.success("Pengguna berhasil dihapus.");
        const { logActivity } = await import("@/lib/activity");
        logActivity("Menghapus Pengguna", `Menghapus akun ${name}`);
        fetchUsers();
      } catch (err: any) {
        toast.error(err.message || "Gagal menghapus pengguna.");
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === "Aktif" ? "Nonaktif" : "Aktif";
    
    // Fetch original user to satisfy validator
    const userObj = users.find((u) => u.id === id);
    if (!userObj) return;

    try {
      const { getAuthHeaders } = await import("@/utils/supabase/client");
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          name: userObj.name,
          email: userObj.email,
          role: userObj.role,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal merubah status pengguna.");
      }

      toast.success("Status pengguna berhasil diubah.");
      const { logActivity } = await import("@/lib/activity");
      logActivity("Mengubah Status Pengguna", `Mengubah status akun ${userObj.email} menjadi ${newStatus}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Gagal merubah status pengguna.");
    }
  };

  // Filter list
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Filter logs list
  const filteredLogs = logs.filter((l) => {
    return (
      (l.user_name?.toLowerCase() || "").includes(logsSearch.toLowerCase()) ||
      (l.user_email?.toLowerCase() || "").includes(logsSearch.toLowerCase()) ||
      (l.action?.toLowerCase() || "").includes(logsSearch.toLowerCase()) ||
      (l.details?.toLowerCase() || "").includes(logsSearch.toLowerCase())
    );
  });

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "Aktif").length;
  const inactiveUsers = users.filter((u) => u.status === "Nonaktif").length;
  const superAdminCount = users.filter((u) => u.role === "super_admin").length;

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
            Kelola Pengguna Dashboard
          </h2>
          <p className="text-xs text-textMuted dark:text-muted-foreground font-sans">
            Tambahkan dan kelola akun internal staf kantor desa Gempolkarya yang berhak mengakses dashboard.
          </p>
        </div>
      </div>

      {/* Stats Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardStatCard
          title="Total Pengguna"
          value={totalUsers.toString()}
          icon={Users}
          description="Akun terdaftar"
        />
        <DashboardStatCard
          title="Pengguna Aktif"
          value={activeUsers.toString()}
          icon={UserCheck}
          description="Dapat login ke sistem"
        />
        <DashboardStatCard
          title="Pengguna Nonaktif"
          value={inactiveUsers.toString()}
          icon={UserX}
          description="Akses ditangguhkan"
        />
        <DashboardStatCard
          title="Super Admin"
          value={superAdminCount.toString()}
          icon={Shield}
          description="Pemilik akses penuh"
        />
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-orinoco/10 dark:border-border/40 gap-4 mt-2">
        <button
          onClick={() => setActiveTab("daftar")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "daftar"
              ? "border-primary text-primary"
              : "border-transparent text-textMuted hover:text-textMain"
          }`}
        >
          <Users className="h-4 w-4" />
          Daftar Pengguna
        </button>
        <button
          onClick={() => setActiveTab("riwayat")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "riwayat"
              ? "border-primary text-primary"
              : "border-transparent text-textMuted hover:text-textMain"
          }`}
        >
          <History className="h-4 w-4" />
          Riwayat Aktivitas
        </button>
      </div>

      {activeTab === "daftar" ? (
        <>
          {/* Toolbar Filters & Add button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-card border border-orinoco/20 dark:border-border/30 rounded-3xl p-5 shadow-sm">
            {/* Search */}
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-bold text-textMain tracking-wide uppercase">Cari Pengguna</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="rounded-xl text-xs bg-cardSoft hover:bg-cardSoft/80 border border-orinoco/20 focus:ring-1 focus:ring-primary p-2.5 h-[38px] font-sans text-textMain focus:outline-none"
              />
            </div>

            {/* Filter Role */}
            <div className="flex flex-col gap-1.5 sm:w-48">
              <label className="text-[10px] font-bold text-textMain tracking-wide uppercase">Filter Peran (Role)</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl text-xs bg-white dark:bg-card border border-orinoco/20 p-2.5 h-[38px] font-sans text-textMain focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">Semua Peran</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin_desa">Admin Desa</option>
              </select>
            </div>

            {/* Add Button */}
            <div className="flex items-end justify-end pt-5 sm:pt-0">
              <Button
                onClick={handleOpenAdd}
                className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-5 px-5 h-[38px] cursor-pointer"
              >
                <Plus className="h-4.5 w-4.5" />
                Tambah Pengguna
              </Button>
            </div>
          </div>

          {/* Main Table */}
          <DashboardTable
            headers={["Nama / Email", "Hak Akses / Peran", "Status", "Tipe Akun", "Terdaftar Pada", "Aksi"]}
            className="mt-2"
          >
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-textMuted font-sans">
                  Memuat data pengguna...
                </TableCell>
              </TableRow>
            ) : (
              <UserManagementTable
                users={filteredUsers}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            )}
          </DashboardTable>
        </>
      ) : (
        <>
          {/* Logs Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white dark:bg-card border border-orinoco/20 dark:border-border/30 rounded-3xl p-5 shadow-sm">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-bold text-textMain tracking-wide uppercase">Cari Aktivitas</label>
              <input
                type="text"
                value={logsSearch}
                onChange={(e) => setLogsSearch(e.target.value)}
                placeholder="Cari kata kunci, email, nama..."
                className="rounded-xl text-xs bg-cardSoft hover:bg-cardSoft/80 border border-orinoco/20 focus:ring-1 focus:ring-primary p-2.5 h-[38px] font-sans text-textMain focus:outline-none"
              />
            </div>
            <div className="flex items-end justify-end pt-5 sm:pt-0">
              <Button
                onClick={fetchLogs}
                disabled={isLogsLoading}
                variant="outline"
                className="rounded-xl text-xs font-semibold border-orinoco/30 text-textMain hover:bg-cardSoft gap-1.5 py-4 cursor-pointer h-[38px]"
              >
                <RefreshCw className={`h-4 w-4 ${isLogsLoading ? "animate-spin" : ""}`} />
                Perbaharui Log
              </Button>
            </div>
          </div>

          {/* Logs Table */}
          <DashboardTable
            headers={["Waktu & Tanggal", "Nama Pengguna", "Email / Akun", "Aksi / Aktivitas", "Detail Kegiatan"]}
            className="mt-2"
          >
            {isLogsLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-textMuted font-sans">
                  Memuat data riwayat...
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-textMuted font-sans">
                  Tidak ada data riwayat aktivitas ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-b border-orinoco/10 dark:border-border/40 hover:bg-cardSoft/30">
                  <TableCell className="px-6 py-4 text-xs font-mono text-textMuted">
                    {new Date(log.created_at).toLocaleString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })}
                  </TableCell>
                  <TableCell className="px-6 py-4 font-bold text-textMain text-xs">{log.user_name}</TableCell>
                  <TableCell className="px-6 py-4 text-xs text-textMuted font-sans">{log.user_email}</TableCell>
                  <TableCell className="px-6 py-4">
                    <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full dark:bg-primary/20 dark:text-accent-foreground text-[10px] uppercase font-bold tracking-wider font-sans">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs text-textMuted leading-relaxed max-w-xs truncate" title={log.details}>
                    {log.details || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </DashboardTable>
        </>
      )}

      {/* Add / Edit Dialog */}
      <UserFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        userToEdit={selectedUser}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
