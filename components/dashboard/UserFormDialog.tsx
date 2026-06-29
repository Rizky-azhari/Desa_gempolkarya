"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userCreateSchema, userEditSchema } from "@/lib/validators";
import { toast } from "sonner";
import { Save, UserPlus, UserCog } from "lucide-react";

interface UserFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userToEdit?: any;
  onSuccess: () => void;
}

const AVAILABLE_ROLES = [
  { value: "admin_desa", label: "Admin Desa" },
];

export function UserFormDialog({ isOpen, onOpenChange, userToEdit, onSuccess }: UserFormDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin_desa");
  const [status, setStatus] = useState<"Aktif" | "Nonaktif">("Aktif");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || "");
      setEmail(userToEdit.email || "");
      setPassword("");
      setRole(userToEdit.role || "admin_desa");
      setStatus(userToEdit.status || "Aktif");
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("admin_desa");
      setStatus("Aktif");
    }
  }, [userToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      name,
      email,
      password: password || undefined,
      role,
      status,
    };

    // Client-side validation using Zod
    const schema = userToEdit ? userEditSchema : userCreateSchema;
    const validation = schema.safeParse(formData);

    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const { getAuthHeaders } = await import("@/utils/supabase/client");
      const url = userToEdit ? `/api/admin/users/${userToEdit.id}` : "/api/admin/users";
      const method = userToEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan data pengguna.");
      }

      toast.success(
        userToEdit
          ? "Data pengguna berhasil diperbarui."
          : "Pengguna berhasil ditambahkan."
      );
      
      // Import dynamic or just make sure it's called
      const { logActivity } = await import("@/lib/activity");
      if (userToEdit) {
        logActivity("Mengubah Data Pengguna", `Mengubah data akun ${email} (${role})`);
      } else {
        logActivity("Menambah Pengguna Baru", `Mendaftarkan akun baru ${email} dengan role ${role}`);
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-orinoco/20 shadow-xl max-w-md w-full font-sans">
        <DialogHeader>
          <DialogTitle className="font-heading font-extrabold text-textMain flex items-center gap-2">
            {userToEdit ? (
              <>
                <UserCog className="h-5 w-5 text-primary" />
                Ubah Data Pengguna
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 text-primary" />
                Tambah Pengguna Baru
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-textMuted font-sans">
            {userToEdit
              ? "Ubah data akun internal pengelola dashboard desa."
              : "Daftarkan akun internal pengelola dashboard desa baru."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Nama Lengkap */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-textMain">Nama Lengkap</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="rounded-xl text-xs bg-white dark:bg-card border-orinoco/20"
              required
              disabled={isLoading}
            />
          </div>

          {/* Alamat Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-textMain">Alamat Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@desa.go.id"
              className="rounded-xl text-xs bg-white dark:bg-card border-orinoco/20"
              required
              disabled={isLoading}
            />
          </div>

          {/* Kata Sandi (Password) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pass" className="text-xs font-semibold text-textMain">
              Password {userToEdit && "(Opsional, isi jika ingin diubah)"}
            </Label>
            <Input
              id="pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={userToEdit ? "••••••••" : "Kata sandi minimal 6 karakter"}
              className="rounded-xl text-xs bg-white dark:bg-card border-orinoco/20"
              required={!userToEdit}
              disabled={isLoading}
            />
          </div>

          {/* Baris Kedua: Role & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="role" className="text-xs font-semibold text-textMain">Role / Hak Akses</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-xl text-xs bg-white dark:bg-card border border-orinoco/20 p-2.5 h-[38px] font-sans text-textMain focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status" className="text-xs font-semibold text-textMain">Status Akun</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "Aktif" | "Nonaktif")}
                className="rounded-xl text-xs bg-white dark:bg-card border border-orinoco/20 p-2.5 h-[38px] font-sans text-textMain focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isLoading}
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-orinoco/10 flex flex-row gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs font-semibold border-orinoco/30 text-textMain hover:bg-cardSoft cursor-pointer"
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
              {isLoading ? "Menyimpan..." : "Simpan Pengguna"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
