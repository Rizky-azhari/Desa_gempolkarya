"use client";

import React, { useState, useEffect } from "react";
import { localUmkmList } from "@/data/umkm";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Store, Phone, MapPin, Image as ImageIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

import { createClient } from "@/utils/supabase/client";

export default function DashboardUmkmPage() {
  const [umkmList, setUmkmList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUmkm, setSelectedUmkm] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    owner: "",
    category: "Kuliner",
    description: "",
    whatsapp: "",
    address: "",
    photo: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400",
  });

  async function loadUmkm() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("umkm")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && !error) {
        setUmkmList(data.map(u => ({
          id: u.id,
          name: u.business_name,
          owner: u.owner_name,
          category: u.category,
          description: u.description || "",
          whatsapp: u.whatsapp || "",
          address: u.location || "",
          photo: u.image_url || "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400"
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }

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

  useEffect(() => {
    loadUmkm().then(() => setMounted(true));
  }, []);

  // Filter list
  const filteredUmkm = umkmList.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.owner.toLowerCase().includes(search.toLowerCase()) ||
    u.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setSelectedUmkm(null);
    setForm({
      name: "",
      owner: "",
      category: "Kuliner",
      description: "",
      whatsapp: "62812",
      address: "Desa Gempolkarya",
      photo: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (umkm: any) => {
    setSelectedUmkm(umkm);
    setForm({
      name: umkm.name,
      owner: umkm.owner,
      category: umkm.category,
      description: umkm.description,
      whatsapp: umkm.whatsapp,
      address: umkm.address,
      photo: umkm.photo || "",
    });
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        business_name: form.name,
        owner_name: form.owner,
        category: form.category,
        description: form.description,
        whatsapp: form.whatsapp,
        location: form.address,
        image_url: form.photo,
        price: "Mulai Rp 10.000",
        is_active: true,
        updated_at: new Date().toISOString()
      };

      if (selectedUmkm) {
        // Edit mode
        const { error } = await supabase.from("umkm").update(payload).eq("id", selectedUmkm.id);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Mengubah Data UMKM", `Mengubah data UMKM: ${form.name}`);
        toast.success(`Informasi UMKM "${form.name}" berhasil diperbarui!`);
      } else {
        // Add mode
        const { error } = await supabase.from("umkm").insert(payload);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Menambah UMKM", `Mendaftarkan UMKM baru: ${form.name}`);
        toast.success(`UMKM "${form.name}" baru berhasil didaftarkan!`);
      }
      setIsDialogOpen(false);
      await loadUmkm();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menyimpan data UMKM: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("umkm").delete().eq("id", id);
      if (error) throw error;
      const { logActivity } = await import("@/lib/activity");
      logActivity("Menghapus UMKM", `Menghapus UMKM: ${name}`);
      toast.success(`UMKM "${name}" berhasil dihapus dari direktori!`);
      await loadUmkm();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menghapus: ${err.message || err}`);
    }
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans p-6">Memuat direktori UMKM...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
          Direktori UMKM & Binaan Desa
        </h2>
        <p className="text-xs text-textMuted dark:text-muted-foreground font-sans">
          Kelola katalog usaha mikro warga desa Citimun, pemilik usaha, kategori dagang, dan hubungi kontak WhatsApp secara terintegrasi.
        </p>
      </div>

      {/* Main Table */}
      <DashboardTable
        title="Daftar Usaha Mikro (UMKM) Binaan"
        headers={["Nama Usaha & Deskripsi", "Pemilik Usaha", "Kategori Bidang", "No WhatsApp", "Aksi"]}
        searchPlaceholder="Cari UMKM..."
        searchValue={search}
        onSearchChange={setSearch}
        extraHeaderActions={
          <Button
            onClick={handleOpenAdd}
            className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-4 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Daftarkan UMKM Baru
          </Button>
        }
      >
        {filteredUmkm.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-textMuted font-sans">
              Tidak ada data UMKM ditemukan.
            </TableCell>
          </TableRow>
        ) : (
          filteredUmkm.map((umkm) => (
            <TableRow key={umkm.id} className="border-b border-orinoco/10 dark:border-border/40 hover:bg-cardSoft/30">
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5 max-w-xs md:max-w-sm">
                  <span className="font-bold text-textMain text-xs md:text-sm">{umkm.name}</span>
                  <span className="text-[10px] text-textMuted line-clamp-1">{umkm.description}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-textMain">{umkm.owner}</span>
                  <span className="text-[10px] text-textMuted uppercase font-semibold font-sans tracking-wide">Pemilik</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 font-semibold text-textMuted uppercase tracking-wider text-[10px]">
                {umkm.category}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold font-sans">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>+{umkm.whatsapp}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenEdit(umkm)}
                    className="h-8 w-8 rounded-lg border-orinoco/30 text-textMuted hover:text-textMain hover:bg-cardSoft"
                    title="Ubah Data"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(umkm.id, umkm.name)}
                    className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:border-red-950 dark:text-red-400"
                    title="Hapus Data"
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
        <DialogContent className="rounded-3xl border-orinoco/20 shadow-xl max-w-lg w-full font-sans max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-extrabold text-textMain">
              {selectedUmkm ? "Ubah Informasi UMKM" : "Daftarkan UMKM Binaan Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-textMuted font-sans">
              Isi formulir pendaftaran badan usaha warga desa Citimun.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-xs font-semibold text-textMain">Nama Toko / Usaha</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Contoh: Kopi Tampomas Citimun"
                  className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="owner" className="text-xs font-semibold text-textMain">Nama Pemilik Usaha</Label>
                <Input
                  id="owner"
                  value={form.owner}
                  onChange={(e) => setForm((prev) => ({ ...prev, owner: e.target.value }))}
                  placeholder="Contoh: Pak Sobirin"
                  className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-textMain">Kategori Bidang</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="rounded-xl text-xs bg-white dark:bg-card border border-orinoco/20 dark:border-border/40 p-2.5 h-[38px] font-sans text-textMain dark:text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full"
                  required
                >
                  <option value="Kuliner">Kuliner</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Pertanian">Pertanian</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Jasa">Jasa / Layanan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="whatsapp" className="text-xs font-semibold text-textMain">Nomor WhatsApp Aktif</Label>
                <Input
                  id="whatsapp"
                  value={form.whatsapp}
                  onChange={(e) => setForm((prev) => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="Contoh: 6281234567890"
                  className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address" className="text-xs font-semibold text-textMain">Alamat Usaha / Rumah Tinggal</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Dusun Cikuda RT 03 / RW 01, Citimun"
                className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-textMain">Deskripsi Produk / Layanan Usaha</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Sediakan ulasan produk-produk andalan, keunggulan usaha, dan jam operasional..."
                className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs min-h-[90px]"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-textMain">Foto Produk / Toko UMKM</Label>
              {form.photo ? (
                <div className="relative h-40 rounded-2xl overflow-hidden border border-orinoco/30 dark:border-border/40 bg-slate-50 group">
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
                <div className="border-2 border-dashed border-orinoco/40 dark:border-border/40 hover:border-orinoco/80 rounded-2xl p-6 text-center bg-cardSoft/50 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const loadingToast = toast.loading("Mengunggah foto UMKM...");
                        try {
                          const url = await handleUploadImage(file, "umkm");
                          setForm((prev) => ({ ...prev, photo: url }));
                          toast.success("Foto UMKM berhasil diunggah!", { id: loadingToast });
                        } catch (err: any) {
                          toast.error(err.message || "Gagal mengunggah foto", { id: loadingToast });
                        }
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <ImageIcon className="h-8 w-8 text-textMuted" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-textMain">Klik untuk Unggah Foto Produk/Toko</span>
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
                className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <Store className="h-4 w-4" />
                {selectedUmkm ? "Simpan Perubahan" : "Daftarkan Usaha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
