"use client";

import React from "react";
import { Info, Sparkles, Filter, Leaf, Landmark, DollarSign, Eye } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localPotentialsList } from "@/data/potentials";
import { villageProfile } from "@/data/village";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function PotensiPage() {
  const breadcrumbs = [{ label: "Potensi Desa" }];

  // Active Category Filter
  const [selectedCat, setSelectedCat] = React.useState<string>("all");

  const categories = [
    { value: "all", label: "Semua Potensi", icon: <Sparkles className="h-3.5 w-3.5 shrink-0" /> },
    { value: "Pertanian & Perkebunan", label: "Pertanian & Perkebunan", icon: <Leaf className="h-3.5 w-3.5 shrink-0" /> },
    { value: "Pariwisata & Pertanian", label: "Wisata", icon: <Leaf className="h-3.5 w-3.5 shrink-0" /> },
    { value: "Kebudayaan & Sejarah", label: "Budaya", icon: <Landmark className="h-3.5 w-3.5 shrink-0" /> },
    { value: "Ekonomi", label: "Ekonomi Masyarakat", icon: <DollarSign className="h-3.5 w-3.5 shrink-0" /> },
  ];

  // Filtering logic
  const filteredList = localPotentialsList.filter((item) => {
    if (selectedCat === "all") return true;
    if (selectedCat === "Ekonomi") {
      return item.category.includes("Ekonomi") || item.category.includes("Kerajinan");
    }
    return item.category === selectedCat;
  });

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* 1. Page Hero */}
      <PageHero
        title="Potensi & Keunggulan Wilayah"
        description={`Menjelajahi potensi agrobisnis di lereng Gunung Tampomas, kelimpahan sumber daya air, industri kerajinan kriya, serta kearifan budaya Desa ${villageProfile.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Overview Introduction */}
      <section className="py-16 bg-eggshell dark:bg-background font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Kekayaan Desa"
            title="Aset Komoditas & Pariwisata Lokal"
            description="Kombinasi iklim sejuk pegunungan kaki Tampomas dan kelimpahan air bersih melahirkan potensi unggulan desa."
          />

          {/* Filters Toolbar */}
          <div className="flex flex-wrap gap-2.5 items-center justify-center bg-cardSoft dark:bg-card border border-orinoco/30 dark:border-border/60 p-4 rounded-2xl mb-10 w-fit mx-auto shadow-sm">
            <span className="text-xs font-bold text-textMuted dark:text-muted-foreground flex items-center gap-1.5 mr-2">
              <Filter className="h-4 w-4 text-primary" /> Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCat(cat.value)}
                className={cn(
                  "text-xs px-4 py-2 rounded-xl font-semibold border transition-all cursor-pointer flex items-center gap-1.5",
                  selectedCat === cat.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-textMuted border-border hover:bg-muted dark:bg-background/20 dark:border-border dark:text-muted-foreground dark:hover:bg-muted/35"
                )}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Potentials Cards Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredList.map((item) => (
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
                      {/* Photo Header */}
                      <div className="relative h-48 w-full overflow-hidden bg-muted border-b border-orinoco/10 dark:border-border/20">
                        <img
                          src={item.photo}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full font-sans shadow-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>
                      <CardHeader className="p-5 pb-2">
                        <CardTitle className="font-heading text-lg font-bold text-textMain dark:text-foreground line-clamp-1 leading-snug">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <p className="text-sm text-textMuted dark:text-muted-foreground font-sans leading-relaxed">
                          {item.description}
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 3. Potential sectors summary info */}
      <section className="py-12 bg-cardSoft dark:bg-card/20 border-t border-orinoco/10 dark:border-border/30 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent-foreground font-bold">
              i
            </div>
            <div>
              <h4 className="text-base font-bold text-textMain dark:text-foreground">Sektor Unggulan Desa Citimun</h4>
              <p className="text-sm text-textMuted dark:text-muted-foreground leading-relaxed mt-1">
                Pemerintah desa bertekad mengoptimalkan agrowisata perkebunan durian bawor dan pengolahan biji kopi Tampomas dengan terus memfasilitasi perizinan legalitas UMKM serta pendampingan akses pemasaran BUMDes Citimun Lestari.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
