"use client";

import React, { useState, useEffect } from "react";
import { newsArticles } from "@/data/news";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { Button } from "@/components/ui/button";
import { villageProfile } from "@/data/village";
import { TableCell, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Calendar, User, FileText, Image as ImageIcon } from "lucide-react";
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

export default function DashboardBeritaPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Kegiatan",
    author: "Sekretariat Desa",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    readTime: "3 Menit",
  });

  async function loadArticles() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && !error) {
        setArticles(data.map(n => ({
          id: n.id,
          title: n.title,
          category: n.category,
          excerpt: n.excerpt || "",
          content: n.content || "",
          author: "Sekretariat Desa",
          date: n.published_at || n.created_at.split("T")[0],
          image: n.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
          readTime: "5 Menit",
          slug: n.slug
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadArticles().then(() => setMounted(true));
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
  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase()) ||
    a.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setSelectedArticle(null);
    setForm({
      title: "",
      excerpt: "",
      content: "",
      category: "Kegiatan",
      author: "Sekretariat Desa",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      readTime: "3 Menit",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (article: any) => {
    setSelectedArticle(article);
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      image: article.image || "",
      readTime: article.readTime || "3 Menit",
    });
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const supabase = createClient();
      const generatedSlug = form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const payload = {
        title: form.title,
        slug: selectedArticle ? selectedArticle.slug : generatedSlug,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        image_url: form.image,
        status: "published" as any,
        published_at: selectedArticle ? selectedArticle.date : new Date().toISOString().split("T")[0],
        updated_at: new Date().toISOString()
      };

      if (selectedArticle) {
        // Edit mode
        const { error } = await supabase.from("news").update(payload).eq("id", selectedArticle.id);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Mengubah Berita", `Mengubah artikel berita: ${form.title}`);
        toast.success("Berita berhasil diperbarui!");
      } else {
        // Add mode
        const { error } = await supabase.from("news").insert(payload);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Menulis Berita", `Menerbitkan artikel berita baru: ${form.title}`);
        toast.success("Berita baru berhasil diterbitkan!");
      }
      setIsDialogOpen(false);
      await loadArticles();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menyimpan berita: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const target = articles.find(a => a.id === id);
      const supabase = createClient();
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
      const { logActivity } = await import("@/lib/activity");
      logActivity("Menghapus Berita", `Menghapus artikel berita: ${target?.title || "Tidak diketahui"}`);
      toast.success("Artikel berita berhasil dihapus!");
      await loadArticles();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menghapus: ${err.message || err}`);
    }
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans p-6">Memuat sistem data berita...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
          Portal Berita & Publikasi Desa
        </h2>
        <p className="text-xs text-textMuted dark:text-muted-foreground font-sans">
          Terbitkan rilis berita pembangunan, sosialisasi program kerja, pengumuman bantuan sosial, dan liputan kegiatan warga Desa {villageProfile.name}.
        </p>
      </div>

      {/* Main Table */}
      <DashboardTable
        title="Daftar Artikel Berita Desa"
        headers={["Judul Berita & Ringkasan", "Kategori", "Penulis", "Tanggal Terbit", "Aksi"]}
        searchPlaceholder="Cari berita..."
        searchValue={search}
        onSearchChange={setSearch}
        extraHeaderActions={
          <Button
            onClick={handleOpenAdd}
            className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-4 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Tulis Berita Baru
          </Button>
        }
      >
        {filteredArticles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-textMuted font-sans">
              Tidak ada data artikel berita ditemukan.
            </TableCell>
          </TableRow>
        ) : (
          filteredArticles.map((art) => (
            <TableRow key={art.id} className="border-b border-orinoco/10 dark:border-border/40 hover:bg-cardSoft/30">
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5 max-w-sm md:max-w-md">
                  <span className="font-bold text-textMain text-xs md:text-sm line-clamp-1">{art.title}</span>
                  <span className="text-[10px] text-textMuted line-clamp-1">{art.excerpt}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 font-semibold text-textMuted uppercase tracking-wider text-[10px]">
                {art.category}
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-textMuted text-xs">
                  <User className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{art.author}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-textMuted text-xs">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{art.date}</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenEdit(art)}
                    className="h-8 w-8 rounded-lg border-orinoco/30 text-textMuted hover:text-textMain hover:bg-cardSoft"
                    title="Edit Artikel"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(art.id)}
                    className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:border-red-950 dark:text-red-400"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </DashboardTable>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl border-orinoco/20 shadow-xl max-w-xl w-full font-sans max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-extrabold text-textMain">
              {selectedArticle ? "Edit Artikel Berita" : "Tulis Artikel Berita Baru"}
            </DialogTitle>
            <DialogDescription className="text-xs text-textMuted font-sans">
              Publikasikan informasi bermanfaat untuk seluruh warga Desa Citimun.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title" className="text-xs font-semibold text-textMain">Judul Berita</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Contoh: Kerja Bakti Gotong Royong RW 04"
                className="rounded-xl border-orinoco/20 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category" className="text-xs font-semibold text-textMain">Kategori</Label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as any }))}
                  className="w-full px-3 py-2.5 border border-orinoco/20 rounded-xl text-xs bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-[#48521C]"
                >
                  <option value="Berita Utama">Berita Utama</option>
                  <option value="Pembangunan">Pembangunan</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Pengumuman">Pengumuman</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="author" className="text-xs font-semibold text-textMain">Penulis / Sumber</Label>
                <Input
                  id="author"
                  value={form.author}
                  onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                  placeholder="Contoh: Sekretariat Desa"
                  className="rounded-xl border-orinoco/20 text-xs"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-textMain">Gambar Sampul Berita</Label>
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
                      Hapus & Ganti Gambar
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
                        const loadingToast = toast.loading("Mengunggah gambar sampul...");
                        try {
                          const url = await handleUploadImage(file, "news");
                          setForm((prev) => ({ ...prev, image: url }));
                          toast.success("Gambar sampul berhasil diunggah!", { id: loadingToast });
                        } catch (err: any) {
                          toast.error(err.message || "Gagal mengunggah gambar", { id: loadingToast });
                        }
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <ImageIcon className="h-8 w-8 text-smoke" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-textMain">Klik untuk Unggah Gambar Sampul</span>
                    <span className="text-[10px] text-textMuted font-sans">Mendukung file PNG, JPG, atau WebP</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="readTime" className="text-xs font-semibold text-textMain">Estimasi Waktu Baca</Label>
              <Input
                id="readTime"
                value={form.readTime}
                onChange={(e) => setForm((prev) => ({ ...prev, readTime: e.target.value }))}
                placeholder="Contoh: 3 Menit"
                className="rounded-xl border-orinoco/20 text-xs"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="excerpt" className="text-xs font-semibold text-textMain">Ringkasan Singkat (Excerpt)</Label>
              <Input
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Rangkuman 1 kalimat tentang isi berita..."
                className="rounded-xl border-orinoco/20 text-xs"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="content" className="text-xs font-semibold text-textMain">Konten Berita Lengkap</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Tuliskan berita lengkap secara mendetail di sini..."
                className="rounded-xl border-orinoco/20 text-xs min-h-[140px]"
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
                <FileText className="h-4 w-4" />
                {selectedArticle ? "Simpan Perubahan" : "Terbitkan Berita"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
