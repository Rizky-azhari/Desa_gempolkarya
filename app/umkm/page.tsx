"use client";

import React, { useState, useEffect } from "react";
import { Compass, Phone, Store, MessageSquare, Filter, ShieldCheck, Mail, MapPin } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { villageProfile } from "@/data/village";

export default function UmkmPage() {
  const breadcrumbs = [{ label: "Direktori UMKM" }];
  const [umkmList, setUmkmList] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  // Active Category Filter
  const [selectedCat, setSelectedCat] = useState<string>("all");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("umkm")
          .select("*")
          .eq("is_active", true)
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
      } finally {
        setMounted(true);
      }
    }
    load();
  }, []);

  const categories = [
    { value: "all", label: "Semua Usaha" },
    { value: "Kuliner", label: "Kuliner & Camilan" },
    { value: "Kerajinan", label: "Kerajinan & Kriya" },
    { value: "Agrobisnis", label: "Agrobisnis & Tanaman" },
  ];

  // Filtering list
  const filteredUmkm = umkmList.filter((item) => {
    if (selectedCat === "all") return true;
    if (selectedCat === "Kuliner") return item.category.includes("Kuliner");
    if (selectedCat === "Kerajinan") return item.category.includes("Kerajinan") || item.category.includes("Kriya") || item.category.includes("Fashion");
    if (selectedCat === "Agrobisnis") return item.category.includes("Agrobisnis") || item.category.includes("Pertanian");
    return item.category === selectedCat;
  });

  const handleContactOwner = (name: string, owner: string, wa: string) => {
    const waText = encodeURIComponent(
      `Halo Ibu/Bapak ${owner}, saya melihat profil usaha *${name}* di Website Resmi Desa ${villageProfile.name}. Saya tertarik untuk menanyakan info produk Anda...`
    );
    window.open(`https://wa.me/${wa}?text=${waText}`, "_blank");
    toast.success(`Membuka WhatsApp pemilik ${name}...`);
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans p-6 text-center">Memuat direktori UMKM...</div>;
  }

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* 1. Page Hero */}
      <PageHero
        title="Direktori Usaha & UMKM Warga"
        description={`Mendukung pertumbuhan ekonomi mandiri warga, temukan produk makanan olahan Tampomas, kopi robusta, kerajinan bambu, dan komoditas unggulan Desa ${villageProfile.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Directory list */}
      <section className="py-16 bg-eggshell dark:bg-background font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Kemandirian Ekonomi"
            title="Daftar Unit Usaha Mikro Desa Citimun"
            description="Dukung produk lokal dengan membeli langsung dari pelaku usaha mikro kecil menengah (UMKM) warga desa kami."
          />

          {/* Filter Toolbar */}
          <div className="flex flex-wrap gap-2.5 items-center justify-center bg-background dark:bg-card border border-orinoco/30 dark:border-border/60 p-4 rounded-2xl mb-10 w-fit mx-auto shadow-sm">
            <span className="text-xs font-bold text-textMuted dark:text-muted-foreground flex items-center gap-1.5 mr-2">
              <Filter className="h-4 w-4 text-primary" /> Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCat(cat.value)}
                className={cn(
                  "text-xs px-4 py-2 rounded-xl font-semibold border transition-all cursor-pointer",
                  selectedCat === cat.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-textMuted border-border hover:bg-muted dark:bg-background/20 dark:border-border dark:text-muted-foreground dark:hover:bg-muted/35"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredUmkm.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="h-full flex"
                >
                  <Card className="overflow-hidden border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card flex flex-col justify-between w-full shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      {/* Photo */}
                      <div className="relative h-48 w-full overflow-hidden bg-muted border-b border-orinoco/10 dark:border-border/20">
                        <img
                          src={item.photo}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full font-sans shadow-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      
                      {/* Details */}
                      <CardHeader className="p-5 pb-2">
                        <CardTitle className="font-heading text-lg font-bold text-textMain dark:text-foreground line-clamp-1 leading-snug">
                          {item.name}
                        </CardTitle>
                        <p className="text-[11px] text-textMuted dark:text-muted-foreground font-sans">
                          Pemilik: <strong className="text-textMain dark:text-foreground font-semibold">{item.owner}</strong>
                        </p>
                      </CardHeader>

                      <CardContent className="p-5 pt-0 flex flex-col gap-3">
                        <p className="text-xs sm:text-sm text-textMuted dark:text-muted-foreground font-sans leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                        <div className="flex gap-2.5 items-start text-[11px] text-textMuted dark:text-muted-foreground font-sans border-t border-orinoco/10 dark:border-border/10 pt-3">
                          <MapPin className="h-4 w-4 shrink-0 text-smoke mt-0.5" />
                          <span className="truncate">{item.address}</span>
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="p-5 pt-0 border-t border-orinoco/10 dark:border-border/30 mt-2 bg-muted/10 p-4">
                      <Button
                        onClick={() => handleContactOwner(item.name, item.owner, item.whatsapp)}
                        className="w-full gap-2 rounded-xl text-xs font-bold cursor-pointer h-10"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Hubungi Pemilik (WA)
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 3. Business registration banner */}
      <section className="py-12 bg-cardSoft dark:bg-card/30 border-t border-orinoco/10 dark:border-border/30 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent-foreground">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-textMain dark:text-foreground">Daftarkan Usaha Anda di Direktori Desa</h4>
              <p className="text-xs sm:text-sm text-textMuted dark:text-muted-foreground leading-relaxed mt-1">
                Apakah Anda warga Desa {villageProfile.name} yang memiliki usaha perdagangan, makanan, kerajinan kriya, atau agrobisnis? Hubungi Sekretariat Desa melalui WhatsApp untuk mendaftarkan nama usaha, kontak, dan foto produk Anda di halaman portal ini secara gratis.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
