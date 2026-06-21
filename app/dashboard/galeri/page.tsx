"use client";

import React, { useState, useEffect } from "react";
import { galleryList } from "@/data/gallery";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, Calendar, Image as ImageIcon, Search } from "lucide-react";
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

export default function DashboardGaleriPage() {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Kegiatan",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800",
    date: "",
  });

  async function loadGallery() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("event_date", { ascending: false });
      if (data && !error) {
        setItems(data.map(g => ({
          id: g.id,
          title: g.title,
          description: g.title,
          category: g.category,
          image: g.image_url,
          date: g.event_date || new Date().toISOString().split("T")[0]
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadGallery().then(() => setMounted(true));
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

  const categories = Array.from(new Set(items.map((i) => i.category)));

  // Filter grid
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setForm({
      title: "",
      description: "",
      category: "Kegiatan",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800",
      date: new Date().toISOString().split("T")[0],
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelectedItem(item);
    setForm({
      title: item.title,
      description: item.description,
      category: item.category,
      image: item.image || "",
      date: item.date,
    });
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        title: form.title,
        category: form.category,
        image_url: form.image,
        event_date: form.date,
        updated_at: new Date().toISOString()
      };

      if (selectedItem) {
        // Edit mode
        const { error } = await supabase.from("gallery").update(payload).eq("id", selectedItem.id);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Mengubah Galeri", `Mengubah foto/kegiatan galeri: ${form.title}`);
        toast.success("Aset galeri berhasil diperbarui!");
      } else {
        // Add mode
        const { error } = await supabase.from("gallery").insert(payload);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Menambah Galeri", `Menambahkan foto/kegiatan galeri baru: ${form.title}`);
        toast.success("Foto kegiatan baru berhasil ditambahkan!");
      }
      setIsDialogOpen(false);
      await loadGallery();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menyimpan foto: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
      const { logActivity } = await import("@/lib/activity");
      logActivity("Menghapus Galeri", `Menghapus foto/kegiatan galeri: ${title}`);
      toast.success(`Foto "${title}" berhasil dihapus dari arsip!`);
      await loadGallery();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menghapus: ${err.message || err}`);
    }
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans p-6">Memuat sistem data galeri...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
            Arsip Galeri Kegiatan Desa
          </h2>
          <p className="text-xs text-textMuted dark:text-muted-foreground font-sans">
            Dokumentasikan foto-foto kegiatan pembangunan fisik, rapat desa, pelayanan posyandu, dan agenda hari besar secara berkelanjutan.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-4 shrink-0 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Unggah Foto Baru
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-card border border-orinoco/20 dark:border-border/60 p-4 rounded-3xl shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted" />
          <Input
            placeholder="Cari arsip galeri..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-orinoco/20 bg-cardSoft hover:bg-cardSoft/80 text-xs h-9"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
          <Button
            variant={categoryFilter === "all" ? "default" : "outline"}
            onClick={() => setCategoryFilter("all")}
            className="rounded-xl text-[10px] uppercase font-bold px-3.5 h-8 cursor-pointer"
          >
            Semua
          </Button>
          {categories.map((cat, idx) => (
            <Button
              key={idx}
              variant={categoryFilter === cat ? "default" : "outline"}
              onClick={() => setCategoryFilter(cat)}
              className="rounded-xl text-[10px] uppercase font-bold px-3.5 h-8 cursor-pointer"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Gallery Photo Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-card border border-orinoco/20 dark:border-border/60 rounded-3xl text-textMuted font-sans">
          Tidak ada foto kegiatan ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-2xl shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
            >
              {/* Card Image Wrapper */}
              <div className="h-44 relative bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-verdun/90 text-white border-none text-[9px] uppercase font-bold tracking-wider font-sans">
                    {item.category}
                  </Badge>
                </div>
                {/* Actions overlay */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 p-1 rounded-xl backdrop-blur-sm">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenEdit(item)}
                    className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                    title="Ubah Foto"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="h-8 w-8 text-red-400 hover:bg-white/20 hover:text-red-500 rounded-lg"
                    title="Hapus Foto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Card Text Info */}
              <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h4 className="font-heading text-xs font-bold text-textMain line-clamp-1 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-textMuted line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-textMuted uppercase font-sans tracking-wide">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{item.date}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl border-orinoco/20 shadow-xl max-w-lg w-full font-sans max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-extrabold text-textMain">
              {selectedItem ? "Ubah Aset Galeri" : "Unggah Dokumentasi Foto Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-textMuted font-sans">
              Tambahkan foto kegiatan administrasi atau fisik ke halaman galeri publik warga.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-textMain">Judul Kegiatan / Foto</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Contoh: Peresmian BUMDes Gempolkarya Sejahtera"
                className="rounded-xl border-orinoco/20 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-textMain">Kategori Galeri</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Kegiatan / Pemerintahan / Pembangunan"
                  className="rounded-xl border-orinoco/20 text-xs"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="date" className="text-xs font-semibold text-textMain">Tanggal Dokumentasi</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="rounded-xl border-orinoco/20 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-textMain">Pilih / Unggah Foto Kegiatan</Label>
              {form.image ? (
                <div className="relative h-40 rounded-2xl overflow-hidden border border-orinoco/30 bg-slate-50 group">
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
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
                        const loadingToast = toast.loading("Mengunggah foto kegiatan...");
                        try {
                          const url = await handleUploadImage(file, "gallery");
                          setForm((prev) => ({ ...prev, image: url }));
                          toast.success("Foto kegiatan berhasil diunggah!", { id: loadingToast });
                        } catch (err: any) {
                          toast.error(err.message || "Gagal mengunggah foto", { id: loadingToast });
                        }
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    required={!selectedItem}
                  />
                  <ImageIcon className="h-8 w-8 text-smoke" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-textMain">Klik untuk Unggah Gambar</span>
                    <span className="text-[10px] text-textMuted font-sans">Mendukung file PNG, JPG, atau WebP</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-textMain">Keterangan / Deskripsi Dokumentasi</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Uraikan rincian singkat kegiatan yang diabadikan pada foto..."
                className="rounded-xl border-orinoco/20 text-xs min-h-[80px]"
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
                className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
              >
                <ImageIcon className="h-4 w-4" />
                {selectedItem ? "Simpan Perubahan" : "Simpan Foto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
