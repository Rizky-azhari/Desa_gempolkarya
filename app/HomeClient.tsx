"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, TreePine, ShieldCheck, HelpCircle, PhoneCall, HeartHandshake, Eye, MessageSquare, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { MapEmbed } from "@/components/ui-custom/MapEmbed";
import { StatSummary } from "@/components/dashboard/StatSummary";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { NewsCard } from "@/components/cards/NewsCard";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { villageProfile } from "@/data/village";
import { publicServices } from "@/data/services";
import { newsArticles } from "@/data/news";
import { localPotentialsList } from "@/data/potentials";
import { publicComplaints } from "@/data/complaints";

import { createClient } from "@/utils/supabase/client";

export default function HomeClient() {
  const [featuredServices, setFeaturedServices] = useState<any[]>(publicServices.slice(0, 3));
  const [recentNews, setRecentNews] = useState<any[]>(newsArticles.slice(0, 3));
  const [featuredPotentials, setFeaturedPotentials] = useState<any[]>(localPotentialsList.slice(0, 3));
  const [recentComplaints, setRecentComplaints] = useState<any[]>(publicComplaints.slice(0, 3));
  const [kades, setKades] = useState<any>({
    name: "H. Dadan Setiawan",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500"
  });
  const [villageData, setVillageData] = useState<any>(villageProfile);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const supabase = createClient();

        // 1. Fetch village profile
        const { data: vProfile } = await supabase.from("village_profile").select("*").maybeSingle();
        if (vProfile) {
          setVillageData({
            name: vProfile.name,
            district: "Tirtajaya",
            regency: "Karawang",
            province: "Jawa Barat",
            address: vProfile.address || "",
            phone: vProfile.phone || "",
            email: vProfile.email || "",
            whatsapp: vProfile.whatsapp || "",
            slogan: vProfile.slogan || "",
            vision: vProfile.vision || "",
            mission: (() => {
              const val = vProfile.mission;
              if (!val) return [];
              if (Array.isArray(val)) return val;
              if (typeof val === "string") {
                const trimmed = val.trim();
                if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                  try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) return parsed;
                  } catch {}
                }
                if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
                  const content = trimmed.slice(1, -1);
                  const items: string[] = [];
                  let current = "";
                  let inQuotes = false;
                  for (let i = 0; i < content.length; i++) {
                    const char = content[i];
                    if (char === '"') {
                      inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                      items.push(current.trim());
                      current = "";
                    } else {
                      current += char;
                    }
                  }
                  if (current) items.push(current.trim());
                  return items.filter(Boolean);
                }
                if (trimmed.includes("\n")) {
                  return trimmed.split("\n").map(m => m.trim()).filter(Boolean);
                }
                if (trimmed.includes(";")) {
                  return trimmed.split(";").map(m => m.trim()).filter(Boolean);
                }
                return [trimmed];
              }
              return [];
            })(),
            history: vProfile.history || "",
            geographic: {
              area: vProfile.area_size || "",
              borders: {
                north: vProfile.north_boundary || "",
                south: vProfile.south_boundary || "",
                east: vProfile.east_boundary || "",
                west: vProfile.west_boundary || "",
              },
              topography: vProfile.geography || "",
            },
            mapEmbedUrl: vProfile.map_embed_url || "",
            statistics: {
              population: String(vProfile.population_total || 0),
              households: String(vProfile.family_total || 0),
              rtCount: vProfile.rt_total || 0,
              rwCount: vProfile.rw_total || 0,
              areaSize: vProfile.area_size || "",
            }
          });
        }

        // 2. Fetch kades
        const { data: kData } = await supabase
          .from("officials")
          .select("*")
          .eq("position", "Kepala Desa")
          .maybeSingle();
        if (kData) {
          setKades({
            name: kData.name,
            photo: kData.photo_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500"
          });
        }

        // 3. Fetch services
        const { data: services } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .limit(3);
        if (services && services.length > 0) {
          setFeaturedServices(services.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description,
            requirements: s.requirements,
            duration: s.estimated_time,
            cost: s.cost || "Gratis",
            category: s.category || "Kependudukan"
          })));
        }

        // 4. Fetch news
        const { data: news } = await supabase
          .from("news")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(3);
        if (news && news.length > 0) {
          setRecentNews(news.map(n => ({
            id: n.id,
            title: n.title,
            excerpt: n.excerpt,
            category: n.category,
            date: n.published_at || n.created_at.split("T")[0],
            image: n.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
            readTime: "5 Menit",
            slug: n.slug
          })));
        }

        // 5. Fetch potentials
        const { data: potentials } = await supabase
          .from("potentials")
          .select("*")
          .limit(3);
        if (potentials && potentials.length > 0) {
          setFeaturedPotentials(potentials.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            category: p.category,
            photo: p.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800"
          })));
        }

        // 6. Fetch complaints (public API)
        const compRes = await fetch("/api/complaints/public");
        const compData = await compRes.json();
        if (Array.isArray(compData) && compData.length > 0) {
          setRecentComplaints(compData.slice(0, 3));
        }

      } catch (err) {
        console.error(err);
      }
    }
    loadHomeData();
  }, []);

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

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* 1. Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-verdun to-textMain text-eggshell px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-smoke/20 via-transparent to-transparent opacity-65" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-orinoco/10 blur-3xl" />
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-smoke/10 blur-3xl" />
        
        <div className="container mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Left */}
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-eggshell/10 px-4 py-1.5 rounded-full border border-orinoco/20 w-fit">
              <TreePine className="h-4.5 w-4.5 text-orinoco animate-pulse" />
              <span className="text-xs uppercase tracking-wider font-bold font-sans text-orinoco">Portal Resmi Desa</span>
            </div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
            >
              Selamat Datang di Desa {villageData.name}
            </motion.h1>
            
            <p className="text-base sm:text-lg text-orinoco/90 font-sans leading-relaxed">
              &ldquo;{villageData.slogan}&rdquo;. Portal pelayanan administrasi digital mandiri, pusat informasi pembangunan terpercaya, dan sarana interaksi warga Desa {villageData.name}.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mt-2"
            >
              <Button asChild size="lg" className="rounded-xl shadow-md cursor-pointer">
                <Link href="/layanan" className="gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Pelayanan Online</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-xl border border-white/20 bg-transparent hover:bg-white/10 text-white hover:text-white cursor-pointer">
                <Link href="/profil" className="gap-2">
                  <span>Jelajahi Profil</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 border-orinoco/30 shadow-2xl aspect-[4/3] bg-cardSoft/10 p-2 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&q=80&w=800"
                alt={`Kantor Desa ${villageData.name}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-textMain/70 via-transparent to-transparent rounded-xl" />
              <div className="absolute bottom-6 left-6 text-white font-sans">
                <p className="text-xs uppercase tracking-wider text-orinoco font-bold">Kantor Kepala Desa</p>
                <p className="text-lg font-heading font-semibold mt-1">Desa {villageData.name}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Sambutan Kepala Desa */}
      <section className="py-16 md:py-24 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Portrait */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-orinoco/60 dark:border-border/60 bg-cardSoft p-1">
                <img
                  src={kades.photo}
                  alt={kades.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
            
            {/* Text details */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              <span className="text-xs uppercase tracking-widest font-bold text-primary font-sans">
                Sambutan Kepala Desa
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-textMain dark:text-foreground">
                Membangun Bersama Demi Kemajuan {villageData.name}
              </h2>
              <div className="h-1 w-16 bg-primary rounded-full" />
              
              <div className="text-sm sm:text-base text-textMuted dark:text-muted-foreground leading-relaxed font-sans flex flex-col gap-4">
                <p>Assalamu’alaikum Warahmatullahi Wabarakatuh,</p>
                <p>
                  Puji syukur kita panjatkan kepada Allah SWT atas rahmat-Nya sehingga website resmi Desa {villageData.name} ini dapat hadir untuk Anda semua. Wadah informasi digital ini kami kembangkan untuk mempermudah akses pelayanan, meningkatkan transparansi publik, dan mendekatkan jajaran aparat desa dengan seluruh lapisan warga.
                </p>
                <p>
                  Melalui portal ini, kami ingin memastikan bahwa seluruh informasi penting terkait pembangunan infrastruktur, pengelolaan dana desa, dan program sosial dapat diakses dengan cepat, akurat, dan terbuka. Kami mengundang seluruh warga untuk terus berkolaborasi dan bersinergi demi mewujudkan {villageData.name} yang Sejahtera, Mandiri, dan Hijau.
                </p>
                <p className="font-semibold text-textMain dark:text-foreground mt-2">
                  {kades.name} — Kepala Desa {villageData.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Statistik Desa */}
      <section className="py-12 md:py-16 bg-cardSoft dark:bg-card/40 border-y border-orinoco/20 dark:border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Dashboard Statistik"
            title="Sekilas Info Demografi"
            description={`Gambaran umum data demografi kependudukan di Desa ${villageData.name}.`}
          />
          <StatSummary />
          <div className="flex justify-center mt-10">
            <Button asChild variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary/5 cursor-pointer">
              <Link href="/data-desa" className="gap-2">
                <span>Lihat Grafik Penduduk Lengkap</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Preview Layanan Desa */}
      <section className="py-16 md:py-24 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Layanan Publik"
            title="Pusat Layanan Surat Pengantar"
            description="Pengurusan persyaratan dokumen administrasi warga jadi lebih cepat dan ringkas secara online."
          />
          {featuredServices.length === 0 ? (
            <div className="text-center py-8 text-textMuted font-sans">
              Belum ada layanan aktif yang terdaftar.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} whatsapp={villageData.whatsapp} />
              ))}
            </div>
          )}
          <div className="flex justify-center mt-12">
            <Button asChild size="lg" className="rounded-xl cursor-pointer">
              <Link href="/layanan" className="gap-2">
                <span>Lihat Semua Layanan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Preview Berita Terbaru */}
      <section className="py-16 md:py-24 bg-cardSoft dark:bg-card/30 border-t border-orinoco/10 dark:border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Kabar Terkini"
            title="Berita & Kegiatan Desa"
            description="Ikuti perkembangan pembangunan, agenda musyawarah, dan informasi bantuan sosial terbaru."
          />
          {recentNews.length === 0 ? (
            <div className="text-center py-8 text-textMuted font-sans">
              Belum ada berita terbit.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {recentNews.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
          <div className="flex justify-center mt-12">
            <Button asChild variant="outline" size="lg" className="rounded-xl border-primary text-primary hover:bg-primary/5 cursor-pointer">
              <Link href="/berita" className="gap-2">
                <span>Kunjungi Portal Berita</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Preview Potensi Desa */}
      <section className="py-16 md:py-24 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Kekayaan Lokal"
            title={`Potensi & Unggulan Desa ${villageData.name}`}
            description={`Melihat potensi pariwisata, pertanian, dan kebudayaan rakyat Desa ${villageData.name}.`}
          />
          {featuredPotentials.length === 0 ? (
            <div className="text-center py-8 text-textMuted font-sans">
              Belum ada data potensi terdaftar.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {featuredPotentials.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="h-full flex"
                >
                  <Card className="overflow-hidden border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card flex flex-col justify-between w-full shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      <div className="relative h-48 w-full overflow-hidden bg-muted">
                        <img
                          src={item.photo}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full font-sans shadow-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <CardHeader className="p-5 pb-2">
                        <h3 className="font-heading text-lg font-bold text-textMain dark:text-foreground line-clamp-1 leading-snug">
                          {item.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <p className="text-sm text-textMuted dark:text-muted-foreground font-sans line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </div>
                    <CardFooter className="p-5 pt-0 border-t border-orinoco/10 dark:border-border/30 mt-4 flex items-center justify-end">
                      <Link
                        href="/potensi"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors font-sans group"
                      >
                        Detail Potensi
                        <Eye className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          <div className="flex justify-center mt-12">
            <Button asChild size="lg" className="rounded-xl cursor-pointer">
              <Link href="/potensi" className="gap-2">
                <span>Lihat Seluruh Potensi</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 7. Preview Pengaduan Warga Terbaru */}
      <section className="py-16 md:py-24 bg-cardSoft dark:bg-card/20 border-t border-orinoco/10 dark:border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Suara Warga"
            title="Laporan & Pengaduan Terbaru"
            description="Transparansi laporan pengaduan infrastruktur dan lingkungan yang diajukan oleh masyarakat."
          />
          {recentComplaints.length === 0 ? (
            <div className="text-center py-8 text-textMuted font-sans">
              Belum ada data pengaduan masuk.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {recentComplaints.map((item) => (
                <Card
                  key={item.id}
                  className="border border-orinoco/30 dark:border-border/60 bg-background dark:bg-card shadow-sm flex flex-col justify-between h-full p-6 font-sans text-sm hover:shadow-md transition-shadow"
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
                    <h3 className="font-heading text-base font-bold text-textMain dark:text-foreground line-clamp-1 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-textMuted dark:text-muted-foreground line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="border-t border-orinoco/10 dark:border-border/30 mt-4 pt-3 flex justify-between items-center text-[11px] text-textMuted dark:text-muted-foreground">
                    <span>Oleh: {item.reporterName}</span>
                    <span>{new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
            <Button asChild size="lg" className="rounded-xl cursor-pointer">
              <Link href="/pengaduan" className="gap-2">
                <MessageSquare className="h-4.5 w-4.5" />
                <span>Buat Pengaduan Warga</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl border-primary text-primary hover:bg-primary/5 cursor-pointer">
              <Link href="/pengaduan#check-status" className="gap-2">
                <AlertCircle className="h-4.5 w-4.5" />
                <span>Pantau Status Pengaduan</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 8. CTA WhatsApp & Location */}
      <section className="py-16 bg-gradient-to-br from-verdun to-textMain text-eggshell border-t border-orinoco/15">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl flex flex-col gap-6 items-center">
          <HeartHandshake className="h-12 w-12 text-orinoco animate-bounce" />
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Layanan WhatsApp Hub Pelayanan Desa {villageData.name}
          </h2>
          <p className="text-base text-orinoco/90 leading-relaxed font-sans max-w-xl">
            Butuh tanggapan cepat terkait pengurusan berkas, pengaduan linmas, atau pertanyaan pembangunan? Klik tombol di bawah untuk langsung terhubung dengan admin pelayanan desa.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-[#25D366] text-white hover:bg-[#20ba5a] font-sans font-bold shadow-lg border-none mt-2 cursor-pointer"
          >
            <a
              href={`https://wa.me/${villageData.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <PhoneCall className="h-5 w-5 fill-white text-[#25D366]" />
              <span>Hubungi WA Pelayanan Desa</span>
            </a>
          </Button>
        </div>
      </section>

      {/* 9. Map & Help Info Section */}
      <section className="py-16 md:py-24 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Map */}
            <div className="lg:col-span-7">
              <MapEmbed height={400} />
            </div>

            {/* Info */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1 rounded-full dark:bg-primary/20 dark:text-accent-foreground text-xs font-bold font-sans w-fit">
                <HelpCircle className="h-4 w-4" />
                <span>Pusat Informasi</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-textMain dark:text-foreground leading-tight">
                Hubungi Kantor Desa & Kunjungi Kami
              </h2>
              <p className="text-sm sm:text-base text-textMuted dark:text-muted-foreground font-sans leading-relaxed">
                Kami siap melayani keperluan administratif dan sosial kemasyarakatan warga. Anda dapat mengunjungi kantor desa pada hari kerja berikut:
              </p>
              <div className="bg-cardSoft dark:bg-card border border-orinoco/40 dark:border-border/60 rounded-2xl p-5 font-sans text-sm flex flex-col gap-2.5">
                <div className="flex justify-between">
                  <span className="font-semibold text-textMain dark:text-foreground">Senin - Jumat:</span>
                  <span className="text-textMuted dark:text-muted-foreground">08.00 - 15.00 WIB</span>
                </div>
                <div className="flex justify-between border-t border-orinoco/20 pt-2">
                  <span className="font-semibold text-textMain dark:text-foreground">Sabtu - Minggu:</span>
                  <span className="text-red-600 dark:text-red-400 font-medium">Tutup (Hari Libur)</span>
                </div>
              </div>
              <Button asChild size="lg" className="rounded-xl w-full sm:w-fit cursor-pointer">
                <Link href="/kontak" className="gap-2">
                  <PhoneCall className="h-4 w-4" />
                  <span>Lihat Kontak Detail</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
