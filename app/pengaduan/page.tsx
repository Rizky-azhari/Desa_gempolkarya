"use client";

import React, { useState, useEffect } from "react";
import { Send, FileSearch, Eye, MessageSquare, AlertCircle, ShieldAlert, CheckCircle2, User, Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { villageProfile } from "@/data/village";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function PengaduanPage() {
  const breadcrumbs = [{ label: "Pengaduan Warga" }];

  // Complaints list
  const [complaints, setComplaints] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formInput, setFormInput] = useState({
    name: "",
    whatsapp: "",
    address: "",
    rtrw: "",
    category: "",
    title: "",
    description: "",
    location: "",
    photo: "",
    isAnonymous: false
  });
  
  // Status check states
  const [searchId, setSearchId] = useState("");
  const [searchedComplaint, setSearchedComplaint] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  async function fetchComplaints() {
    try {
      const res = await fetch("/api/complaints/public");
      const data = await res.json();
      if (Array.isArray(data)) {
        setComplaints(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchComplaints().then(() => setMounted(true));
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (val: string) => {
    setFormInput((prev) => ({ ...prev, category: val }));
  };

  const handleCheckboxToggle = () => {
    setFormInput((prev) => ({ ...prev, isAnonymous: !prev.isAnonymous }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formInput.title || !formInput.description || !formInput.category || !formInput.whatsapp) {
      toast.error("Harap isi seluruh kolom wajib (*).");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Mengirim laporan pengaduan Anda...");
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formInput.title,
          description: formInput.description,
          category: formInput.category,
          whatsapp: formInput.whatsapp,
          reporter_name: formInput.isAnonymous ? "Anonim" : (formInput.name || "Umum"),
          address: formInput.address,
          rt_rw: formInput.rtrw,
          incident_location: formInput.location,
          photo_url: formInput.photo || null,
          is_anonymous: formInput.isAnonymous
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal mengirim pengaduan");
      }
      
      toast.success(`Pengaduan berhasil terkirim! Simpan ID Anda: ${data.ticket_number}`, {
        id: loadingToast,
        duration: 10000,
      });

      // Reset form input
      setFormInput({
        name: "",
        whatsapp: "",
        address: "",
        rtrw: "",
        category: "",
        title: "",
        description: "",
        location: "",
        photo: "",
        isAnonymous: false
      });

      // Reload list
      await fetchComplaints();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengirim pengaduan", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) {
      toast.error("Harap masukkan ID Pengaduan (contoh: PGD-YYYYMMDD-XXXX)");
      return;
    }

    // Normalize: strip common prefixes like 'ID: ' and trim whitespace
    const normalized = searchId.trim().replace(/^id:\s*/i, "").toUpperCase();

    const found = complaints.find(
      (c) => c.id.toUpperCase() === normalized
    );

    setSearchedComplaint(found || null);
    setHasSearched(true);

    if (found) {
      toast.success(`Ditemukan data pengaduan: ${found.title}`);
    } else {
      toast.error("ID Pengaduan tidak ditemukan. Pastikan format ID benar.");
    }
  };

  const getComplaintBadgeStatus = (status: string) => {
    switch (status) {
      case "Selesai":
        return "success";
      case "Sedang Diproses":
        return "warning";
      case "Belum Diproses":
      default:
        return "neutral";
    }
  };

  if (!mounted) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center font-sans text-xs text-textMuted">
        Memuat sistem pengaduan warga...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* 1. Page Hero */}
      <PageHero
        title="Pusat Pengaduan & Aspirasi Warga"
        description={`Sampaikan keluhan infrastruktur, kebersihan lingkungan, atau gangguan ketertiban umum secara langsung dan transparan ke Pemerintah Desa ${villageProfile.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Form & Search Grid */}
      <section className="py-16 bg-eggshell dark:bg-background font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left: Input form */}
            <div className="lg:col-span-7">
              <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm h-full flex flex-col justify-between p-6 sm:p-8">
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-textMain dark:text-foreground">
                      Formulir Pengaduan Warga
                    </h3>
                    <p className="text-xs text-textMuted dark:text-muted-foreground mt-0.5 leading-relaxed">
                      Layanan pengaduan ini dijamin aman. Anda juga dapat memilih opsi Anonim untuk menyembunyikan identitas Anda pada feed publik.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-textMain dark:text-foreground">
                        Nama Pengadu (Sesuai KTP)
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formInput.name}
                        onChange={handleFormChange}
                        placeholder="Nama Lengkap"
                        disabled={formInput.isAnonymous}
                        className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="whatsapp" className="text-xs font-bold text-textMain dark:text-foreground">
                        Nomor WhatsApp Aktif *
                      </label>
                      <Input
                        type="tel"
                        id="whatsapp"
                        name="whatsapp"
                        value={formInput.whatsapp}
                        onChange={handleFormChange}
                        placeholder="Contoh: 0812xxxx"
                        className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="address" className="text-xs font-bold text-textMain dark:text-foreground">
                        Alamat Dusun / Jalan *
                      </label>
                      <Input
                        type="text"
                        id="address"
                        name="address"
                        value={formInput.address}
                        onChange={handleFormChange}
                        placeholder="Contoh: Dusun Krajan"
                        className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="rtrw" className="text-xs font-bold text-textMain dark:text-foreground">
                        RT / RW *
                      </label>
                      <Input
                        type="text"
                        id="rtrw"
                        name="rtrw"
                        value={formInput.rtrw}
                        onChange={handleFormChange}
                        placeholder="Contoh: RT 03 / RW 01"
                        className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-textMain dark:text-foreground">
                        Kategori Laporan *
                      </label>
                      <Select onValueChange={handleCategorySelect} value={formInput.category}>
                        <SelectTrigger className="rounded-xl border-border focus:ring-primary text-sm bg-background dark:bg-background/20">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent className="font-sans">
                          <SelectItem value="Infrastruktur">Infrastruktur & Jalan</SelectItem>
                          <SelectItem value="Kebersihan & Lingkungan">Kebersihan & Lingkungan</SelectItem>
                          <SelectItem value="Fasilitas Umum">Fasilitas Umum</SelectItem>
                          <SelectItem value="Keamanan & Ketertiban">Keamanan & Ketertiban</SelectItem>
                          <SelectItem value="Pelayanan Publik">Pelayanan Publik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="location" className="text-xs font-bold text-textMain dark:text-foreground">
                        Lokasi Kejadian / Objek Laporan
                      </label>
                      <Input
                        type="text"
                        id="location"
                        name="location"
                        value={formInput.location}
                        onChange={handleFormChange}
                        placeholder="Contoh: Depan Kantor Kepala Dusun"
                        className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="title" className="text-xs font-bold text-textMain dark:text-foreground">
                      Judul Laporan *
                    </label>
                    <Input
                      type="text"
                      id="title"
                      name="title"
                      value={formInput.title}
                      onChange={handleFormChange}
                      placeholder="Tuliskan judul keluhan utama"
                      className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="description" className="text-xs font-bold text-textMain dark:text-foreground">
                      Isi Laporan Pengaduan *
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formInput.description}
                      onChange={handleFormChange}
                      placeholder="Jelaskan secara rinci kronologi kejadian atau kondisi objek yang dikeluhkan..."
                      rows={4}
                      className="rounded-xl border-border focus-visible:ring-primary text-sm resize-none bg-background dark:bg-background/20"
                      required
                    />
                  </div>

                  {/* Photo upload section */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-textMain dark:text-foreground">
                      Upload Foto Pendukung (Bukti Objek)
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl border-orinoco/50 cursor-pointer bg-background/50 hover:bg-muted/50 dark:bg-background/10 dark:border-border transition-colors">
                        <div className="flex flex-col items-center justify-center pt-3 pb-3 text-center text-xs text-textMuted dark:text-muted-foreground">
                          {formInput.photo ? (
                            <div className="text-emerald-600 font-bold flex flex-col items-center gap-1">
                              <span className="text-[10px]">Gambar bukti berhasil diunggah!</span>
                              <img src={formInput.photo} className="h-10 object-contain rounded-md" alt="Bukti" />
                            </div>
                          ) : (
                            <>
                              <p className="font-semibold">Klik untuk memilih file</p>
                              <p className="text-[10px]">PNG, JPG, JPEG (Max. 5MB)</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const loadingToast = toast.loading("Mengunggah foto bukti...");
                              try {
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("bucket", "complaints");
                                const res = await fetch("/api/upload", {
                                  method: "POST",
                                  body: formData
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.error || "Gagal mengunggah foto");
                                setFormInput(prev => ({ ...prev, photo: data.url }));
                                toast.success("Foto bukti berhasil diunggah!", { id: loadingToast });
                              } catch (err: any) {
                                toast.error(err.message || "Gagal mengunggah foto", { id: loadingToast });
                              }
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Anonymity toggle */}
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="checkbox"
                      id="isAnonymous"
                      checked={formInput.isAnonymous}
                      onChange={handleCheckboxToggle}
                      className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                    />
                    <label htmlFor="isAnonymous" className="text-xs font-semibold text-textMain dark:text-foreground cursor-pointer select-none">
                      Kirim sebagai Anonim (Sembunyikan identitas Anda dari publik)
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gap-2 rounded-xl text-xs font-bold cursor-pointer h-11 mt-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "Mengirim..." : "Kirim Pengaduan Warga"}
                    </span>
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right: Status checker (cek status pengaduan) */}
            <div className="lg:col-span-5 flex flex-col gap-6" id="check-status">
              <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm p-6 flex flex-col gap-4">
                <form onSubmit={handleCheckStatus} className="flex flex-col gap-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-textMain dark:text-foreground flex items-center gap-2">
                      <FileSearch className="h-5 w-5 text-primary" />
                      Cek Status Pengaduan
                    </h3>
                    <p className="text-xs text-textMuted dark:text-muted-foreground mt-0.5 leading-relaxed">
                      Masukkan ID Pengaduan Anda (contoh: **PGD-YYYYMMDD-XXXX**) untuk memantau sejauh mana laporan Anda ditindaklanjuti.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Masukkan ID Pengaduan"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                    />
                    <Button type="submit" className="rounded-xl gap-1 px-4 cursor-pointer">
                      Cari
                    </Button>
                  </div>
                </form>

                {/* Status Result */}
                <AnimatePresence mode="wait">
                  {hasSearched && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2"
                    >
                      {searchedComplaint ? (
                        <div className="border border-orinoco/40 dark:border-border/60 rounded-xl p-4 bg-background dark:bg-background/10 text-xs flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[10px] text-textMuted dark:text-muted-foreground font-mono">
                              ID: {searchedComplaint.id.toUpperCase()}
                            </span>
                            <StatusBadge status={getComplaintBadgeStatus(searchedComplaint.status)}>
                              {searchedComplaint.status}
                            </StatusBadge>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <h4 className="font-bold text-textMain dark:text-foreground text-sm line-clamp-1">
                              {searchedComplaint.title}
                            </h4>
                            <p className="text-textMuted dark:text-muted-foreground leading-relaxed text-[11px] line-clamp-3">
                              {searchedComplaint.description}
                            </p>
                          </div>

                          {searchedComplaint.photoUrl && (
                            <div className="relative w-full h-36 overflow-hidden rounded-xl bg-muted border border-orinoco/10 dark:border-border/10 group">
                              <a href={searchedComplaint.photoUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                <img
                                  src={searchedComplaint.photoUrl}
                                  alt={searchedComplaint.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </a>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-2 text-[10px] text-textMuted border-t border-orinoco/10 dark:border-border/10 pt-2">
                            <span>Kategori: <strong>{searchedComplaint.category}</strong></span>
                            <span>Pelapor: <strong>{searchedComplaint.reporterName}</strong></span>
                          </div>

                          {searchedComplaint.response && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-1 flex flex-col gap-1">
                              <span className="font-bold text-primary dark:text-accent-foreground text-[10px] flex items-center gap-1.5">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Tanggapan Pemdes:
                              </span>
                              <p className="text-[11px] text-textMuted dark:text-muted-foreground leading-relaxed">
                                {searchedComplaint.response}
                              </p>
                              {searchedComplaint.responseDate && (
                                <span className="text-[9px] text-textMuted/60 text-right mt-1 font-mono">
                                  Dijawab pada {new Date(searchedComplaint.responseDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="border border-red-200 rounded-xl p-4 bg-red-50 text-red-700 text-xs flex gap-2 items-start dark:bg-red-950/20 dark:border-red-900/30 dark:text-red-400">
                          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">Laporan Tidak Ditemukan</p>
                            <p className="text-[11px] mt-0.5 leading-relaxed">
                              ID Pengaduan tidak terdaftar. Pastikan format ID yang Anda cari sudah benar (contoh: PGD-YYYYMMDD-XXXX).
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* Informational guide */}
              <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm p-6 flex flex-col gap-4 text-xs leading-relaxed text-textMuted dark:text-muted-foreground">
                <div className="flex gap-2.5 items-start">
                  <ShieldAlert className="h-5 w-5 text-primary shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-textMain dark:text-foreground text-sm">Privasi & Keamanan Pengaduan</h4>
                    <p className="mt-1">
                      Pemerintah Desa {villageProfile.name} menjamin kerahasiaan kontak WhatsApp dan alamat tinggal pelapor. Opsi Anonim akan menyembunyikan nama Anda di seluruh halaman umum.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Daftar Pengaduan Terbaru */}
      <section className="py-16 md:py-20 bg-cardSoft dark:bg-card/30 border-t border-orinoco/10 dark:border-border/30 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Feed Transparansi"
            title="Laporan Pengaduan Terkini"
            description="Pantau progres tindak lanjut seluruh laporan pengaduan masuk secara real-time."
          />

          {complaints.length === 0 ? (
            <div className="text-center py-16 text-xs text-textMuted bg-background dark:bg-card border border-orinoco/20 dark:border-border/60 rounded-3xl">
              Belum ada data pengaduan masuk.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {complaints.slice(0, 6).map((item) => (
                <Card
                  key={item.id}
                  className="border border-orinoco/30 dark:border-border/60 bg-background dark:bg-card shadow-sm flex flex-col justify-between h-full p-6 text-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-textMuted dark:text-muted-foreground uppercase tracking-wider">
                        {item.category}
                      </span>
                      <StatusBadge status={getComplaintBadgeStatus(item.status)}>
                        {item.status}
                      </StatusBadge>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[10px] text-textMuted dark:text-muted-foreground font-mono">
                      <Clock className="h-3.5 w-3.5" /> ID: {item.id.toUpperCase()}
                    </div>

                    <h3 className="font-heading text-base font-bold text-textMain dark:text-foreground line-clamp-1 leading-snug">
                      {item.title}
                    </h3>
                    
                    <p className="text-xs text-textMuted dark:text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {item.photoUrl && (
                      <div className="mt-3 relative w-full h-40 overflow-hidden rounded-xl bg-muted border border-orinoco/10 dark:border-border/10 group">
                        <a href={item.photoUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                          <img
                            src={item.photoUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-orinoco/10 dark:border-border/30 mt-4 pt-3 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] text-textMuted dark:text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {item.reporterName}
                      </span>
                      <span>{new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                    </div>

                    {item.response && (
                      <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-2.5 mt-1 flex flex-col gap-0.5 text-[11px] leading-snug">
                        <span className="font-bold text-primary dark:text-accent-foreground text-[10px]">Tindak Lanjut:</span>
                        <p className="text-textMuted dark:text-muted-foreground line-clamp-2">{item.response}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
