"use client";

import React, { useState, useEffect } from "react";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Clock, HelpCircle, Eye, Reply, Trash2 } from "lucide-react";
import { useRole } from "@/components/dashboard/RoleContext";

import { createClient } from "@/utils/supabase/client";

export default function DashboardPengaduanPage() {
  const { currentRole } = useRole();
  const isSuperAdmin = currentRole === "super_admin";
  const [complaints, setComplaints] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [responseStatus, setResponseStatus] = useState("Selesai");
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function loadComplaints() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data && !error) {
        setComplaints(data.map(c => ({
          id: c.ticket_number,
          dbId: c.id,
          reporterName: c.reporter_name || "Umum",
          whatsapp: c.whatsapp || "",
          address: c.address || "",
          rtRw: c.rt_rw || "",
          location: c.incident_location || "",
          photo: c.photo_url || "",
          isAnonymous: !!c.is_anonymous,
          title: c.title,
          description: c.description,
          category: c.category,
          date: c.created_at.split("T")[0],
          status: c.status === "Dikirim" ? "Belum Diproses" : c.status === "Diproses" || c.status === "Ditindaklanjuti" ? "Sedang Diproses" : "Selesai",
          response: c.officer_note || ""
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    loadComplaints().then(() => setMounted(true));
  }, []);

  // Filter lists
  const categories = Array.from(new Set(complaints.map((c) => c.category)));

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.reporterName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || c.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Selesai":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50 font-semibold font-sans">
            <CheckCircle2 className="h-3 w-3 mr-1 shrink-0" />
            Selesai
          </Badge>
        );
      case "Sedang Diproses":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50 font-semibold font-sans">
            <Clock className="h-3 w-3 mr-1 shrink-0" />
            Proses
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 font-semibold font-sans">
            <HelpCircle className="h-3 w-3 mr-1 shrink-0" />
            Masuk
          </Badge>
        );
    }
  };

  const handleQuickStatusChange = async (id: string, newStatus: any) => {
    try {
      const supabase = createClient();
      let dbStatus = "Dikirim";
      if (newStatus === "Sedang Diproses") {
        dbStatus = "Diproses";
      } else if (newStatus === "Selesai") {
        dbStatus = "Selesai";
      }

      const { error } = await supabase
        .from("complaints")
        .update({
          status: dbStatus as any,
          updated_at: new Date().toISOString()
        })
        .eq("ticket_number", id);

      if (error) throw error;
      const { logActivity } = await import("@/lib/activity");
      logActivity("Mengubah Status Pengaduan", `Mengubah status tiket pengaduan ${id} menjadi ${newStatus}`);
      toast.success(`Status pengaduan ${id} berhasil diubah menjadi ${newStatus}!`);
      await loadComplaints();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal mengubah status: ${err.message || err}`);
    }
  };

  const handleOpenDetail = (complaint: any) => {
    setSelectedComplaint(complaint);
    setResponseText(complaint.response || "");
    setResponseStatus(complaint.status);
    setIsDetailOpen(true);
  };

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const supabase = createClient();
      let dbStatus = "Dikirim";
      if (responseStatus === "Sedang Diproses") {
        dbStatus = "Diproses";
      } else if (responseStatus === "Selesai") {
        dbStatus = "Selesai";
      }

      const { error } = await supabase
        .from("complaints")
        .update({
          status: dbStatus as any,
          officer_note: responseText,
          updated_at: new Date().toISOString()
        })
        .eq("ticket_number", selectedComplaint.id);

      if (error) throw error;
      const { logActivity } = await import("@/lib/activity");
      logActivity("Menanggapi Pengaduan", `Memberikan tanggapan resmi dan mengubah status tiket pengaduan ${selectedComplaint.id} menjadi ${responseStatus}`);
      toast.success(`Tanggapan pengaduan ${selectedComplaint.id} berhasil disimpan!`);
      setIsDetailOpen(false);
      await loadComplaints();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menyimpan tanggapan: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteComplaint = async (dbId: string, ticketNumber: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus laporan pengaduan dengan nomor tiket "${ticketNumber}"?`)) {
      try {
        const { getAuthHeaders } = await import("@/utils/supabase/client");
        const res = await fetch(`/api/complaints?id=${dbId}`, {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Gagal menghapus laporan pengaduan.");
        }
        toast.success(`Laporan pengaduan ${ticketNumber} berhasil dihapus.`);
        const { logActivity } = await import("@/lib/activity");
        logActivity("Menghapus Pengaduan", `Menghapus tiket pengaduan ${ticketNumber}`);
        await loadComplaints();
      } catch (err: any) {
        console.error(err);
        toast.error(`Gagal menghapus laporan: ${err.message || err}`);
      }
    }
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans p-6">Memuat sistem data pengaduan...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
          Daftar Pengaduan & Aspirasi Warga
        </h2>
        <p className="text-xs text-textMuted dark:text-muted-foreground font-sans">
          Pantau keluhan masyarakat mengenai infrastruktur, jalan, kebersihan lingkungan, pelayanan publik, hubungi pelapor, dan berikan tanggapan resmi.
        </p>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white dark:bg-card border border-orinoco/20 dark:border-border/60 p-4 rounded-3xl shadow-sm">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-textMuted">Filter Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="rounded-xl border-orinoco/20 text-xs bg-cardSoft hover:bg-cardSoft/80 h-9 font-medium">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs font-sans">Semua Status</SelectItem>
              <SelectItem value="Belum Diproses" className="text-xs font-sans">Belum Diproses / Masuk</SelectItem>
              <SelectItem value="Sedang Diproses" className="text-xs font-sans">Sedang Diproses</SelectItem>
              <SelectItem value="Selesai" className="text-xs font-sans">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-textMuted">Filter Kategori</Label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="rounded-xl border-orinoco/20 text-xs bg-cardSoft hover:bg-cardSoft/80 h-9 font-medium">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="text-xs font-sans">Semua Kategori</SelectItem>
              {categories.map((cat, idx) => (
                <SelectItem key={idx} value={cat} className="text-xs font-sans">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 justify-end">
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setCategoryFilter("all");
              toast.info("Filter berhasil direset!");
            }}
            className="rounded-xl border-orinoco/30 hover:bg-cardSoft text-xs font-semibold h-9 cursor-pointer"
          >
            Reset Semua Filter
          </Button>
        </div>
      </div>

      {/* Complaints Table */}
      <DashboardTable
        title="Daftar Laporan Pengaduan Warga"
        headers={["ID Laporan", "Judul & Pelapor", "Kategori", "Tanggal Masuk", "Status", "Aksi"]}
        searchPlaceholder="Cari berdasarkan ID, judul, nama..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        {filteredComplaints.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-textMuted font-sans">
              Tidak ada data laporan pengaduan ditemukan.
            </TableCell>
          </TableRow>
        ) : (
          filteredComplaints.map((c) => (
            <TableRow key={c.dbId} className="border-b border-orinoco/10 dark:border-border/40 hover:bg-cardSoft/30">
              <TableCell className="px-6 py-4 font-bold text-textMain font-mono text-xs">{c.id.toUpperCase()}</TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5 max-w-xs md:max-w-sm">
                  <span className="font-bold text-textMain text-xs line-clamp-1">{c.title}</span>
                  <span className="text-[10px] text-textMuted">
                    Oleh: {c.reporterName} {c.isAnonymous && <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider">(Anonim)</span>}
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 font-semibold text-textMuted uppercase tracking-wider text-[10px]">
                {c.category}
              </TableCell>
              <TableCell className="px-6 py-4 text-textMuted text-xs">{c.date}</TableCell>
              <TableCell className="px-6 py-4">{getStatusBadge(c.status)}</TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Select
                    value={c.status}
                    onValueChange={(val) => handleQuickStatusChange(c.id, val)}
                  >
                    <SelectTrigger className="h-8 w-[130px] rounded-lg border-orinoco/20 text-[10px] font-semibold bg-cardSoft hover:bg-cardSoft/80">
                      <SelectValue placeholder="Ubah Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg">
                      <SelectItem value="Belum Diproses" className="text-[10px] font-sans">Belum Diproses</SelectItem>
                      <SelectItem value="Sedang Diproses" className="text-[10px] font-sans">Sedang Diproses</SelectItem>
                      <SelectItem value="Selesai" className="text-[10px] font-sans">Selesai</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenDetail(c)}
                    className="h-8 w-8 rounded-lg border-orinoco/30 text-textMuted hover:text-textMain hover:bg-cardSoft"
                    title="Detail & Tanggapan"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>

                  {isSuperAdmin && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteComplaint(c.dbId, c.id)}
                      className="h-8 w-8 rounded-lg border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/30"
                      title="Hapus Laporan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </DashboardTable>

      {/* Detail & Response Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="rounded-3xl border-orinoco/20 shadow-xl max-w-lg w-full font-sans max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-extrabold text-textMain flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary shrink-0" />
              Detail Pengaduan {selectedComplaint?.id.toUpperCase()}
            </DialogTitle>
            <DialogDescription className="text-xs text-textMuted font-sans">
              Laporkan tindak lanjut dan berikan tanggapan resmi dari pihak pemerintah desa.
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <form onSubmit={handleResponseSubmit} className="space-y-4 py-2">
              <div className="p-4 bg-cardSoft rounded-2xl border border-orinoco/20 space-y-2.5 text-xs">
                <div className="grid grid-cols-2 gap-2 text-textMuted">
                  <div>
                    <span className="font-semibold block text-[10px] uppercase">Pelapor</span>
                    <span className="font-bold text-textMain text-xs">
                      {selectedComplaint.reporterName} {selectedComplaint.isAnonymous && <span className="text-[9px] text-red-500 font-bold uppercase tracking-wider">(Anonim)</span>}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold block text-[10px] uppercase">Tanggal Masuk</span>
                    <span className="font-bold text-textMain text-xs">{selectedComplaint.date}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-textMuted border-t border-orinoco/10 pt-2">
                  <div>
                    <span className="font-semibold block text-[10px] uppercase">No. WhatsApp Pelapor</span>
                    <span className="font-bold text-textMain text-xs">
                      {selectedComplaint.whatsapp ? (
                        <a href={`https://wa.me/${selectedComplaint.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">
                          {selectedComplaint.whatsapp}
                        </a>
                      ) : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold block text-[10px] uppercase">Alamat & RT/RW</span>
                    <span className="font-bold text-textMain text-xs">
                      {selectedComplaint.address} {selectedComplaint.rtRw ? `(${selectedComplaint.rtRw})` : ""}
                    </span>
                  </div>
                </div>

                <div className="border-t border-orinoco/10 pt-2 text-textMuted">
                  <span className="font-semibold block text-[10px] uppercase">Kategori & Judul</span>
                  <span className="font-bold text-textMain text-xs block">{selectedComplaint.category} - {selectedComplaint.title}</span>
                </div>

                <div className="border-t border-orinoco/10 pt-2">
                  <span className="font-semibold block text-[10px] uppercase text-textMuted">Isi Pengaduan / Keluhan</span>
                  <p className="text-textMain leading-relaxed font-sans text-xs mt-1 bg-white/70 dark:bg-card/70 p-2.5 rounded-xl border border-orinoco/10 dark:border-border/30">
                    {selectedComplaint.description}
                  </p>
                </div>

                {selectedComplaint.location && (
                  <div className="border-t border-orinoco/10 pt-2 text-textMuted">
                    <span className="font-semibold block text-[10px] uppercase">Lokasi Kejadian</span>
                    <span className="font-medium text-textMain text-xs block mt-0.5">{selectedComplaint.location}</span>
                  </div>
                )}

                {selectedComplaint.photo && (
                  <div className="border-t border-orinoco/10 pt-2">
                    <span className="font-semibold block text-[10px] uppercase text-textMuted">Foto Bukti Laporan</span>
                    <a href={selectedComplaint.photo} target="_blank" rel="noopener noreferrer" className="block mt-1 max-h-48 rounded-xl overflow-hidden border border-orinoco/20 bg-slate-100">
                      <img src={selectedComplaint.photo} alt="Bukti Kejadian" className="w-full h-full object-contain max-h-48" />
                    </a>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="respStatus" className="text-xs font-semibold text-textMain">Set Status Penyelesaian</Label>
                  <Select value={responseStatus} onValueChange={setResponseStatus}>
                    <SelectTrigger className="rounded-xl border-orinoco/20 dark:border-border/40 text-xs bg-white dark:bg-card text-textMain dark:text-foreground h-9">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Belum Diproses" className="text-xs font-sans">Belum Diproses / Masuk</SelectItem>
                      <SelectItem value="Sedang Diproses" className="text-xs font-sans">Sedang Diproses / Tindak Lanjut</SelectItem>
                      <SelectItem value="Selesai" className="text-xs font-sans">Selesai / Teratasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="tanggapan" className="text-xs font-semibold text-textMain">Tanggapan Resmi Instansi</Label>
                  <Textarea
                    id="tanggapan"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Tuliskan respon resmi, solusi yang telah atau akan diambil..."
                    className="rounded-xl bg-white dark:bg-card border-orinoco/20 dark:border-border/40 text-textMain dark:text-foreground text-xs min-h-[90px]"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="pt-4 border-t border-orinoco/10 flex flex-row gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                  className="rounded-xl text-xs font-semibold border-orinoco/30 text-textMain hover:bg-cardSoft cursor-pointer"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
                >
                  <Reply className="h-3.5 w-3.5" />
                  {isSaving ? "Menyimpan..." : "Kirim Tanggapan"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
