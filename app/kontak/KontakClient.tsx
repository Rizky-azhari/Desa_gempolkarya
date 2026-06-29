"use client";

import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { MapEmbed } from "@/components/ui-custom/MapEmbed";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { villageProfile } from "@/data/village";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function KontakClient() {
  const breadcrumbs = [{ label: "Kontak Kami" }];
  
  const [villageData, setVillageData] = useState<any>(villageProfile);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("village_profile").select("*").maybeSingle();
        if (data && !error) {
          setVillageData({
            name: data.name,
            address: data.address || villageProfile.address,
            phone: data.phone || villageProfile.phone,
            email: data.email || villageProfile.email,
            whatsapp: data.whatsapp || villageProfile.whatsapp,
          });
        }
      } catch (e) {
        console.error("Gagal memuat profil desa di kontak:", e);
      }
    }
    loadProfile();
  }, []);
  
  // Form submission state
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Harap isi nama, email, dan pesan Anda sebelum mengirim.");
      return;
    }
    
    setLoading(true);
    // Simulate submission delay
    setTimeout(() => {
      setLoading(false);
      toast.success("Pesan terkirim! Jajaran aparat desa akan segera merespon masukan Anda.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* 1. Page Hero */}
      <PageHero
        title="Kontak & Layanan Bantuan"
        description={`Hubungi layanan pelanggan digital atau kirimkan saran/aspirasi langsung ke Pemerintah Desa ${villageData.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Contact Details & Form */}
      <section className="py-16 md:py-24 bg-eggshell dark:bg-background">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
             {/* Left: Contact Info */}
             <div className="lg:col-span-5 flex flex-col gap-6 font-sans">
               <div className="flex flex-col gap-3">
                 <span className="text-xs uppercase tracking-widest font-bold text-primary">
                   Hubungi Kami
                 </span>
                 <h2 className="font-heading text-2xl sm:text-3xl font-bold text-textMain dark:text-foreground">
                   Informasi Kontak Kantor Desa
                 </h2>
                 <div className="h-1 w-16 bg-primary rounded-full" />
                 <p className="text-sm text-textMuted dark:text-muted-foreground leading-relaxed mt-2">
                   Punya pertanyaan seputar syarat KTP, beasiswa stunting, bantuan sosial BLT, atau program pembangunan desa? Silakan hubungi kami melalui saluran berikut:
                 </p>
               </div>

               {/* Detail Blocks */}
               <div className="flex flex-col gap-4">
                 <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm">
                   <CardContent className="p-4 flex gap-4 items-start">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent-foreground">
                       <MapPin className="h-5 w-5" />
                     </div>
                     <div>
                       <h4 className="font-bold text-textMain dark:text-foreground text-sm">Alamat Kantor Desa</h4>
                       <p className="text-xs text-textMuted dark:text-muted-foreground mt-1 leading-relaxed">
                         {villageData.address}
                       </p>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm">
                   <CardContent className="p-4 flex gap-4 items-start">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent-foreground">
                       <Phone className="h-5 w-5" />
                     </div>
                     <div>
                       <h4 className="font-bold text-textMain dark:text-foreground text-sm">Nomor Telepon & WA</h4>
                       <p className="text-xs text-textMuted dark:text-muted-foreground mt-1">
                         Telp: {villageData.phone}
                       </p>
                       <p className="text-xs text-textMuted dark:text-muted-foreground mt-0.5">
                         WhatsApp: +{villageData.whatsapp}
                       </p>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm">
                   <CardContent className="p-4 flex gap-4 items-start">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent-foreground">
                       <Mail className="h-5 w-5" />
                     </div>
                     <div>
                       <h4 className="font-bold text-textMain dark:text-foreground text-sm">Email Resmi</h4>
                       <p className="text-xs text-textMuted dark:text-muted-foreground mt-1">
                         {villageData.email}
                       </p>
                     </div>
                   </CardContent>
                 </Card>

                 <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm">
                   <CardContent className="p-4 flex gap-4 items-start">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent-foreground">
                       <Clock className="h-5 w-5" />
                     </div>
                     <div>
                       <h4 className="font-bold text-textMain dark:text-foreground text-sm">Jam Operasional Layanan</h4>
                       <p className="text-xs text-textMuted dark:text-muted-foreground mt-1">
                         Senin - Jumat: 08.00 - 15.00 WIB
                       </p>
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </div>

             {/* Right: Suggestion Form */}
             <div className="lg:col-span-7">
               <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm h-full flex flex-col justify-between p-6 sm:p-8 font-sans">
                 <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                   <div>
                     <h3 className="font-heading text-xl font-bold text-textMain dark:text-foreground">
                       Formulir Hubungi Kami
                     </h3>
                     <p className="text-xs text-textMuted dark:text-muted-foreground mt-0.5 leading-relaxed">
                       Saran, aduan lingkungan, aspirasi pembangunan, atau pertanyaan tertulis Anda dapat dikirimkan langsung menggunakan form di bawah.
                     </p>
                   </div>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-1.5">
                       <label htmlFor="name" className="text-xs font-bold text-textMain dark:text-foreground">
                         Nama Lengkap *
                       </label>
                       <Input
                         type="text"
                         id="name"
                         name="name"
                         value={formData.name}
                         onChange={handleChange}
                         placeholder="Masukkan nama Anda"
                         className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                         required
                       />
                     </div>

                     <div className="flex flex-col gap-1.5">
                       <label htmlFor="email" className="text-xs font-bold text-textMain dark:text-foreground">
                         Alamat Email *
                       </label>
                       <Input
                         type="email"
                         id="email"
                         name="email"
                         value={formData.email}
                         onChange={handleChange}
                         placeholder="Masukkan email Anda"
                         className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                         required
                       />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="flex flex-col gap-1.5">
                       <label htmlFor="phone" className="text-xs font-bold text-textMain dark:text-foreground">
                         Nomor Handphone (WA)
                       </label>
                       <Input
                         type="tel"
                         id="phone"
                         name="phone"
                         value={formData.phone}
                         onChange={handleChange}
                         placeholder="Contoh: 0812xxxx"
                         className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                       />
                     </div>

                     <div className="flex flex-col gap-1.5">
                       <label htmlFor="subject" className="text-xs font-bold text-textMain dark:text-foreground">
                         Subjek Pesan
                       </label>
                       <Input
                         type="text"
                         id="subject"
                         name="subject"
                         value={formData.subject}
                         onChange={handleChange}
                         placeholder="Contoh: Pengaduan/Saran"
                         className="rounded-xl border-border focus-visible:ring-primary text-sm bg-background dark:bg-background/20"
                       />
                     </div>
                   </div>

                   <div className="flex flex-col gap-1.5">
                     <label htmlFor="message" className="text-xs font-bold text-textMain dark:text-foreground">
                       Isi Pesan / Saran *
                     </label>
                     <Textarea
                       id="message"
                       name="message"
                       value={formData.message}
                       onChange={handleChange}
                       placeholder="Tuliskan pesan, aspirasi, atau aduan Anda secara jelas..."
                       rows={5}
                       className="rounded-xl border-border focus-visible:ring-primary text-sm resize-none bg-background dark:bg-background/20"
                       required
                     />
                   </div>

                   <div className="flex gap-2 items-start bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3.5 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                     <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                     <p className="leading-relaxed">
                       Harap berikan data kontak secara akurat agar kami dapat menindaklanjuti dan mengabari Anda kembali.
                     </p>
                   </div>

                   <Button
                     type="submit"
                     className="w-full gap-2 rounded-xl text-xs font-bold cursor-pointer h-11"
                     disabled={loading}
                   >
                     <Send className="h-4 w-4" />
                     <span>{loading ? "Mengirim..." : "Kirim Masukan"}</span>
                   </Button>
                 </form>
               </Card>
             </div>
           </div>
         </div>
       </section>

       {/* 3. Map Location Section */}
       <section className="py-12 md:py-16 bg-cardSoft dark:bg-card/20 border-t border-orinoco/10 dark:border-border/30">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <SectionHeader
             label="Kunjungi Kami"
             title={`Lokasi Kantor Desa ${villageData.name}`}
             description="Datang langsung ke kantor kami untuk validasi berkas fisik, pertemuan publik, or koordinasi tata tertib desa."
           />
           <MapEmbed height={450} />
         </div>
       </section>
    </div>
  );
}
