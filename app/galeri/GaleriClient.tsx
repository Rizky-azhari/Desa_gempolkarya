"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Tag, X, Expand, Filter } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { villageProfile } from "@/data/village";
import { galleryList } from "@/data/gallery";
import { createClient } from "@/utils/supabase/client";

export default function GaleriClient() {
  const breadcrumbs = [{ label: "Galeri Foto" }];

  // States initialized with local static data for SSR
  const [items, setItems] = useState<any[]>(galleryList);
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [activePhoto, setActivePhoto] = useState<any>(null);

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
          description: g.title, // Map title to description fallback
          category: g.category,
          image: g.image_url,
          date: g.event_date || new Date().toISOString().split("T")[0]
        })));
      }
    } catch (e) {
      console.error("Gagal memuat galeri:", e);
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  // Compute unique categories dynamically from items
  const dynamicCategories = Array.from(new Set(items.map((i) => i.category)));
  const categories = [
    { value: "all", label: "Semua Foto" },
    ...dynamicCategories.map((cat) => ({ value: cat, label: cat }))
  ];

  // Filtering list
  const filteredGallery = items.filter((item) => {
    return selectedCat === "all" || item.category === selectedCat;
  });

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* 1. Page Hero */}
      <PageHero
        title="Galeri & Dokumentasi Kegiatan"
        description={`Kumpulan foto dokumentasi pembangunan, program kemasyarakatan, kegiatan keagamaan, pelayanan kesehatan posyandu, dan musyawarah Desa ${villageProfile.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Gallery Area */}
      <section className="py-16 bg-eggshell dark:bg-background font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Dokumentasi Visual"
            title={`Galeri Foto Kegiatan ${villageProfile.name}`}
            description="Jejak digital pembangunan infrastruktur dan partisipasi aktif warga desa."
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

          {/* Photos Grid */}
          {filteredGallery.length === 0 ? (
            <div className="text-center py-16 text-textMuted border border-orinoco/20 dark:border-border/60 rounded-3xl bg-background/50">
              Tidak ada dokumentasi kegiatan ditemukan untuk kategori ini.
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredGallery.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => setActivePhoto(item)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-orinoco/30 dark:border-border/60 shadow-sm bg-cardSoft hover:shadow-md transition-all flex flex-col h-full"
                  >
                    {/* Photo container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white">
                          <Expand className="h-5 w-5 animate-pulse" />
                        </div>
                      </div>

                      <div className="absolute top-3 left-3">
                        <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-[9px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full font-sans">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Descriptions */}
                    <div className="p-4 flex-1 flex flex-col justify-between gap-2">
                      <h3 className="font-heading text-sm font-bold text-textMain dark:text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[10px] text-textMuted dark:text-muted-foreground font-sans">
                        <Calendar className="h-3.5 w-3.5 text-smoke shrink-0" />
                        <span>{new Date(item.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* 3. Lightbox Modal Preview Dialog */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            {/* Click backdrop to close */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={() => setActivePhoto(null)} />

            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-3xl bg-background border border-orinoco/40 dark:border-border/60 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col font-sans"
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Large Image */}
              <div className="relative aspect-[16/10] bg-black">
                <img
                  src={activePhoto.image}
                  alt={activePhoto.title}
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full">
                    {activePhoto.category}
                  </span>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-6 sm:p-8 flex flex-col gap-3 bg-cardSoft dark:bg-card">
                <div className="flex flex-wrap justify-between items-center gap-2 text-xs text-textMuted dark:text-muted-foreground border-b border-orinoco/10 dark:border-border/10 pb-2.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-smoke" />
                    Dokumentasi tanggal: <strong>{new Date(activePhoto.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-4 w-4 text-smoke" />
                    Kategori: <strong>{activePhoto.category}</strong>
                  </span>
                </div>
                
                <h3 className="font-heading text-lg sm:text-xl font-bold text-textMain dark:text-foreground leading-snug">
                  {activePhoto.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-textMuted dark:text-muted-foreground leading-relaxed">
                  {activePhoto.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
