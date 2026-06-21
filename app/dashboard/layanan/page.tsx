"use client";

import React, { useState, useEffect } from "react";
import { publicServices } from "@/data/services";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, CheckCircle, Clock, ShieldAlert } from "lucide-react";
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

export default function DashboardLayananPage() {
  const [services, setServices] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    cost: "Gratis",
    category: "Administrasi",
    requirements: "",
  });

  async function loadServices() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && !error) {
        setServices(data.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description || "",
          duration: s.estimated_time || "-",
          cost: s.cost || "Gratis",
          category: s.category || "Administrasi",
          requirements: s.requirements || [],
          slug: s.slug
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadServices().then(() => setMounted(true));
  }, []);

  // Filter list
  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setSelectedService(null);
    setForm({
      title: "",
      description: "",
      duration: "",
      cost: "Gratis",
      category: "Administrasi",
      requirements: "1. Surat pengantar RT/RW setempat\n2. Fotokopi KTP & KK",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (service: any) => {
    setSelectedService(service);
    setForm({
      title: service.title,
      description: service.description,
      duration: service.duration,
      cost: service.cost,
      category: service.category,
      requirements: service.requirements.join("\n"),
    });
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (service: any) => {
    setSelectedService(service);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const supabase = createClient();
      const generatedSlug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = {
        title: form.title,
        slug: selectedService ? selectedService.slug : generatedSlug,
        description: form.description,
        estimated_time: form.duration,
        cost: form.cost,
        category: form.category,
        requirements: form.requirements.split("\n").filter((r) => r.trim() !== ""),
        updated_at: new Date().toISOString()
      };

      if (selectedService) {
        // Edit mode
        const { error } = await supabase.from("services").update(payload).eq("id", selectedService.id);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Mengubah Layanan Publik", `Mengubah detail layanan surat: ${form.title}`);
        toast.success("Layanan publik berhasil diperbarui!");
      } else {
        // Add mode
        const { error } = await supabase.from("services").insert(payload);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Menambah Layanan Publik", `Menambahkan layanan surat baru: ${form.title}`);
        toast.success("Layanan publik baru berhasil ditambahkan!");
      }
      setIsDialogOpen(false);
      await loadServices();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menyimpan layanan: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("services").delete().eq("id", selectedService.id);
      if (error) throw error;
      const { logActivity } = await import("@/lib/activity");
      logActivity("Menghapus Layanan Publik", `Menghapus layanan surat: ${selectedService.title}`);
      toast.success("Layanan publik berhasil dihapus!");
      setIsDeleteOpen(false);
      await loadServices();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menghapus: ${err.message || err}`);
    }
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans p-6">Memuat sistem data layanan publik...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
            Administrasi Layanan Publik
          </h2>
          <p className="text-xs text-textMuted dark:text-muted-foreground font-sans">
            Kelola jenis persuratan, berkas persyaratan, waktu proses, dan biaya pelayanan administrasi desa.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <DashboardTable
        title="Daftar Surat Pelayanan Publik"
        headers={["Nama Layanan / Persuratan", "Kategori", "Durasi Proses", "Biaya", "Aksi"]}
        searchPlaceholder="Cari surat..."
        searchValue={search}
        onSearchChange={setSearch}
        extraHeaderActions={
          <Button
            onClick={handleOpenAdd}
            className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-4 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Tambah Layanan
          </Button>
        }
      >
        {filteredServices.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-textMuted font-sans">
              Tidak ada data layanan ditemukan.
            </TableCell>
          </TableRow>
        ) : (
          filteredServices.map((service) => (
            <TableRow key={service.id} className="border-b border-orinoco/10 dark:border-border/40 hover:bg-cardSoft/30">
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5 max-w-sm">
                  <span className="font-bold text-textMain text-xs md:text-sm">{service.title}</span>
                  <span className="text-[10px] text-textMuted line-clamp-1">{service.description}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 font-semibold text-textMuted uppercase tracking-wider text-[10px]">
                {service.category}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-textMain">
                  <Clock className="h-3.5 w-3.5 text-smoke shrink-0" />
                  <span>{service.duration}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-200/50">
                  {service.cost}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenEdit(service)}
                    className="h-8 w-8 rounded-lg border-orinoco/30 text-textMuted hover:text-textMain hover:bg-cardSoft"
                    title="Ubah Layanan"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDelete(service)}
                    className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/30"
                    title="Hapus Layanan"
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
              {selectedService ? "Ubah Surat Pelayanan" : "Tambah Layanan Publik"}
            </DialogTitle>
            <DialogDescription className="text-xs text-textMuted font-sans">
              Isi data detail layanan publik yang akan ditampilkan di situs publik warga.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-textMain">Nama Persuratan / Layanan</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Contoh: Surat Keterangan Usaha (SKU)"
                className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-textMain">Deskripsi Singkat</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Penjelasan fungsi surat..."
                className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs min-h-[50px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="duration" className="text-xs font-semibold text-textMain">Waktu Penyelesaian</Label>
                <Input
                  id="duration"
                  value={form.duration}
                  onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="Contoh: Same Day (30 Menit)"
                  className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-textMain">Kategori</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2.5 border border-orinoco/20 dark:border-border/40 rounded-xl text-xs bg-white dark:bg-card text-textMain dark:text-foreground focus:outline-none focus:ring-1 focus:ring-[#48521C]"
                >
                  <option value="Administrasi">Administrasi</option>
                  <option value="Kependudukan">Kependudukan</option>
                  <option value="Kesejahteraan">Kesejahteraan</option>
                  <option value="Umum">Umum</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cost" className="text-xs font-semibold text-[#48521C] dark:text-foreground">Biaya Pelayanan</Label>
              <Input
                id="cost"
                value={form.cost}
                onChange={(e) => setForm((prev) => ({ ...prev, cost: e.target.value }))}
                placeholder="Contoh: Gratis, atau Rp 5.000, atau Sukarela"
                className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="requirements" className="text-xs font-semibold text-textMain">Berkas Persyaratan (Satu per baris)</Label>
              <Textarea
                id="requirements"
                value={form.requirements}
                onChange={(e) => setForm((prev) => ({ ...prev, requirements: e.target.value }))}
                placeholder="1. Surat pengantar RT/RW&#10;2. Fotokopi KK"
                className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs min-h-[80px]"
                required
              />
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
                className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {selectedService ? "Simpan Perubahan" : "Simpan Layanan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="rounded-3xl border-orinoco/20 shadow-xl max-w-sm w-full font-sans">
          <DialogHeader className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <DialogTitle className="font-heading font-extrabold text-textMain text-center">
              Konfirmasi Hapus
            </DialogTitle>
            <DialogDescription className="text-xs text-textMuted text-center font-sans">
              Apakah Anda yakin ingin menghapus pelayanan surat <strong className="text-textMain">{selectedService?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-2 flex flex-row gap-3 w-full justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 rounded-xl text-xs font-semibold border-orinoco/30 text-textMain hover:bg-cardSoft cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleDeleteConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Ya, Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
