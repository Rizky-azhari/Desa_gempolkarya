"use client";

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "./RoleBadge";
import { Edit, Trash2, Power, Ban, ShieldCheck } from "lucide-react";
import { UserRole } from "@/lib/roles";
import { toast } from "sonner";

interface UserManagementTableProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (id: string, name: string) => void;
  onToggleStatus: (id: string, currentStatus: string, name: string) => void;
}

export function UserManagementTable({
  users,
  onEdit,
  onDelete,
  onToggleStatus,
}: UserManagementTableProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <>
      {users.length === 0 ? (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-8 text-textMuted font-sans">
            Tidak ada pengguna ditemukan.
          </TableCell>
        </TableRow>
      ) : (
        users.map((user) => {
          const isFixed = !!user.fixed;

          return (
            <TableRow
              key={user.id}
              className="border-b border-orinoco/10 dark:border-border/40 hover:bg-cardSoft/30"
            >
              {/* Nama & Email */}
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-textMain text-xs md:text-sm">{user.name}</span>
                  <span className="text-[10px] text-textMuted font-mono">{user.email}</span>
                </div>
              </TableCell>

              {/* Role */}
              <TableCell className="px-6 py-4">
                <RoleBadge role={user.role as UserRole} />
              </TableCell>

              {/* Status */}
              <TableCell className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans tracking-wide uppercase border ${
                    user.status === "Aktif"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50"
                      : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      user.status === "Aktif" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {user.status}
                </span>
              </TableCell>

              {/* Tipe Akun */}
              <TableCell className="px-6 py-4 font-sans">
                {isFixed ? (
                  <span className="inline-flex items-center gap-1 text-primary text-[10px] font-extrabold bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Akun Sistem
                  </span>
                ) : (
                  <span className="text-textMuted text-[10px] font-semibold bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 px-2 py-0.5 rounded-lg">
                    Akun Internal
                  </span>
                )}
              </TableCell>

              {/* Tanggal Terdaftar */}
              <TableCell className="px-6 py-4 font-sans text-textMuted text-[10px]">
                {formatDate(user.created_at)}
              </TableCell>

              {/* Aksi */}
              <TableCell className="px-6 py-4 text-right">
                {isFixed ? (
                  <span className="text-[10px] font-bold text-textMuted/60 uppercase tracking-wider bg-cardSoft px-2.5 py-1.5 rounded-xl border border-orinoco/10">
                    Tidak dapat diubah
                  </span>
                ) : (
                  <div className="flex items-center justify-end gap-2">
                    {/* Toggle Status Active/Inactive */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onToggleStatus(user.id, user.status, user.name)}
                      className={`h-8 w-8 rounded-lg transition-colors ${
                        user.status === "Aktif"
                          ? "border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                          : "border-emerald-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                      }`}
                      title={user.status === "Aktif" ? "Nonaktifkan Akun" : "Aktifkan Akun"}
                    >
                      <Power className="h-3.5 w-3.5" />
                    </Button>

                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(user)}
                      className="h-8 w-8 rounded-lg border-orinoco/30 text-textMuted hover:text-textMain hover:bg-cardSoft"
                      title="Ubah Pengguna"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(user.id, user.name)}
                      className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Hapus Pengguna"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          );
        })
      )}
    </>
  );
}
