"use client";

import React, { useState, useEffect } from "react";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Mail, CreditCard, Shield, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createClient } from "@/utils/supabase/client";

export default function DashboardPerangkatDesaPage() {
  const [officials, setOfficials] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOfficial, setSelectedOfficial] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    role: "",
    nip: "",
    email: "",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500",
    category: "Perangkat",
    sort_order: 1,
  });

  async function loadOfficials() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("officials")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data && !error) {
        setOfficials(data.map(o => ({
          id: o.id,
          name: o.name,
          role: o.position,
          nip: o.nip || "",
          email: o.email || "",
          photo: o.photo_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500",
          category: o.category || "Perangkat",
          sort_order: o.sort_order || 0
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadOfficials().then(() => setMounted(true));
  }, []);

  const handleUploadImage = async (file: File, bucket: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", bucket);
    
    const { getAuthHeaders } = await import("@/utils/supabase/client");
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
      },
      body: formData
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Gagal mengunggah gambar");
    }
    return data.url;
  };

  // Filter list
  const filteredOfficials = officials.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.role.toLowerCase().includes(search.toLowerCase()) ||
    o.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setSelectedOfficial(null);
    setForm({
      name: "",
      role: "",
      nip: "",
      email: "",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500",
      category: "Perangkat",
      sort_order: officials.length > 0 ? Math.max(...officials.map(o => o.sort_order || 0)) + 1 : 1,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (official: any) => {
    setSelectedOfficial(official);
    setForm({
      name: official.name,
      role: official.role,
      nip: official.nip || "",
      email: official.email || "",
      photo: official.photo || "",
      category: official.category || "Perangkat",
      sort_order: official.sort_order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        name: form.name,
        position: form.role,
        nip: form.nip || null,
        email: form.email || null,
        photo_url: form.photo,
        category: form.category,
        sort_order: Number(form.sort_order),
        updated_at: new Date().toISOString()
      };

      if (selectedOfficial) {
        // Edit mode
        const { error } = await supabase.from("officials").update(payload).eq("id", selectedOfficial.id);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Mengubah Profil Aparatur", `Mengubah data aparatur desa: ${form.name} (${form.role})`);
        toast.success(`Profil aparatur "${form.name}" berhasil diperbarui!`);
      } else {
        // Add mode
        const { error } = await supabase.from("officials").insert(payload);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Menambah Aparatur Desa", `Menambahkan aparatur desa baru: ${form.name} (${form.role})`);
        toast.success(`Aparatur "${form.name}" baru berhasil ditambahkan!`);
      }
      setIsDialogOpen(false);
      await loadOfficials();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menyimpan data perangkat: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("officials").delete().eq("id", id);
      if (error) throw error;
      const { logActivity } = await import("@/lib/activity");
      logActivity("Menghapus Aparatur Desa", `Menghapus aparatur desa: ${name}`);
      toast.success(`Aparatur "${name}" berhasil dinonaktifkan dari struktur!`);
      await loadOfficials();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menonaktifkan aparatur: ${err.message || err}`);
    }
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans p-6">Memuat sistem data pemerintahan...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
            Struktur Pemerintahan & Aparatur Desa
          </h2>
          <p className="text-xs text-textMuted dark:text-muted-foreground font-sans">
            Kelola kepengurusan aparatur desa, NIP kepegawaian resmi, email internal, kategori tugas, dan urutan visual di halaman pemerintahan.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-4 shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Tambah Perangkat Baru
        </Button>
      </div>

      {/* Main Table */}
      <DashboardTable
        title="Daftar Perangkat Desa & Staf Administrasi"
        headers={["Nama Aparatur", "Jabatan & Kategori", "NIP Resmi", "Email Pemdes", "Aksi"]}
        searchPlaceholder="Cari aparatur..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        {filteredOfficials.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-textMuted font-sans">
              Tidak ada data aparatur desa ditemukan.
            </TableCell>
          </TableRow>
        ) : (
          filteredOfficials.map((o) => (
            <TableRow key={o.id} className="border-b border-orinoco/10 dark:border-border/40 hover:bg-cardSoft/30">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border border-orinoco/20 shrink-0 bg-slate-50">
                    <img src={o.photo} alt={o.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-textMain text-xs md:text-sm">{o.name}</span>
                    <span className="text-[10px] text-textMuted font-mono">Urutan: {o.sort_order}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5 text-textMain font-bold text-xs">
                    <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{o.role}</span>
                  </div>
                  <span className="text-[9px] font-semibold text-smoke uppercase tracking-wide">
                    {o.category}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                {o.nip ? (
                  <div className="flex items-center gap-1.5 text-textMuted text-xs font-mono">
                    <CreditCard className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{o.nip}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-textMuted/70 font-semibold uppercase tracking-wider font-sans">-</span>
                )}
              </TableCell>
              <TableCell className="px-6 py-4">
                {o.email ? (
                  <div className="flex items-center gap-1.5 text-textMuted text-xs font-sans">
                    <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{o.email}</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-textMuted/70 font-semibold uppercase tracking-wider font-sans">-</span>
                )}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenEdit(o)}
                    className="h-8 w-8 rounded-lg border-orinoco/30 text-textMuted hover:text-textMain hover:bg-cardSoft"
                    title="Ubah Profil"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(o.id, o.name)}
                    className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:border-red-950 dark:text-red-400"
                    title="Hapus Aparatur"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </DashboardTable>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl border-orinoco/20 shadow-xl max-w-md w-full font-sans max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-extrabold text-textMain">
              {selectedOfficial ? "Ubah Profil Aparatur" : "Tambah Perangkat Desa Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-textMuted font-sans">
              Isi data jabatan, identitas, kategori penempatan, dan detail kontak personil aparatur desa.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name" className="text-xs font-semibold text-textMain">Nama Lengkap & Gelar</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Sri Mulyani, S.Sos."
                className="rounded-xl border-orinoco/20 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="role" className="text-xs font-semibold text-textMain">Jabatan Pemerintahan</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="Contoh: Kasi Pemerintahan / Kepala Dusun"
                  className="rounded-xl border-orinoco/20 text-xs"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-textMain">Kategori Tampilan</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-orinoco/20 rounded-xl text-xs bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-[#48521C]"
                >
                  <option value="Perangkat">Perangkat Desa</option>
                  <option value="Kewilayahan">Kewilayahan (Kadus)</option>
                  <option value="Lembaga">Lembaga Kemasyarakatan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nip" className="text-xs font-semibold text-textMain">NIP Pegawai (Opsional)</Label>
                <Input
                  id="nip"
                  value={form.nip}
                  onChange={(e) => setForm((prev) => ({ ...prev, nip: e.target.value }))}
                  placeholder="Contoh: 19831112..."
                  className="rounded-xl border-orinoco/20 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-textMain">Email Resmi (Opsional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Contoh: sekdes@gempolkarya.desa.id"
                  className="rounded-xl border-orinoco/20 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="sort_order" className="text-xs font-semibold text-textMain">Urutan Tampilan (Sort Order)</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((prev) => ({ ...prev, sort_order: Number(e.target.value) }))}
                  className="rounded-xl border-orinoco/20 text-xs"
                  required
                  min={1}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-textMain">Foto Profil Perangkat Desa</Label>
              {form.photo ? (
                <div className="relative h-40 rounded-2xl overflow-hidden border border-orinoco/30 bg-slate-50 group">
                  <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setForm((prev) => ({ ...prev, photo: "" }))}
                      className="rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Hapus & Ganti Foto
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-orinoco/40 hover:border-orinoco/80 rounded-2xl p-6 text-center bg-cardSoft/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const loadingToast = toast.loading("Mengunggah foto profil...");
                        try {
                          const url = await handleUploadImage(file, "officials");
                          setForm((prev) => ({ ...prev, photo: url }));
                          toast.success("Foto profil berhasil diunggah!", { id: loadingToast });
                        } catch (err: any) {
                          toast.error(err.message || "Gagal mengunggah foto", { id: loadingToast });
                        }
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <ImageIcon className="h-8 w-8 text-smoke" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-textMain">Klik untuk Unggah Foto Profil</span>
                    <span className="text-[10px] text-textMuted font-sans">Mendukung file PNG, JPG, atau WebP</span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-orinoco/10 flex flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl text-xs font-semibold border-orinoco/30 text-textMain hover:bg-cardSoft cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perangkat"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
