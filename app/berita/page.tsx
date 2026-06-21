"use client";

import React, { useState, useEffect } from "react";
import { Search, RotateCcw } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { NewsCard } from "@/components/cards/NewsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { villageProfile } from "@/data/village";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

export default function BeritaPage() {
  const breadcrumbs = [{ label: "Berita & Kegiatan" }];
  const [articles, setArticles] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  
  // States for search and categories filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false });
        if (data && !error) {
          setArticles(data.map(n => ({
            id: n.slug || n.id,
            title: n.title,
            category: n.category,
            excerpt: n.excerpt || "",
            content: n.content || "",
            image: n.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
            date: n.published_at || new Date().toISOString(),
            author: "Admin Desa",
            readTime: "5 Menit"
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
    { value: "all", label: "Semua Kategori" },
    { value: "Berita Utama", label: "Berita Utama" },
    { value: "Pengumuman", label: "Pengumuman" },
    { value: "Pembangunan", label: "Pembangunan" },
    { value: "Kegiatan", label: "Kegiatan" },
  ];

  // Filtering logic
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans p-6 text-center">Memuat rilis berita desa...</div>;
  }

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* 1. Page Hero */}
      <PageHero
        title="Kabar & Informasi Desa"
        description={`Portal berita pembangunan, kegiatan kemasyarakatan, pengumuman bantuan sosial, dan liputan khusus Desa ${villageProfile.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Content & Filters */}
      <section className="py-16 md:py-24 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label={`Kabar ${villageProfile.name}`}
            title="Agenda & Rilis Resmi Pemerintah Desa"
            description="Temukan dokumentasi terpercaya mengenai arah pembangunan dan kabar terkini di sekitar desa."
          />

          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-cardSoft dark:bg-card border border-orinoco/40 dark:border-border/60 p-5 rounded-2xl mb-10 w-full font-sans">
            {/* Left: Category filters */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={cn(
                    "text-xs px-3.5 py-2 rounded-xl font-semibold border transition-all cursor-pointer",
                    selectedCategory === cat.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-textMuted border-border hover:bg-muted dark:bg-background/20 dark:border-border dark:text-muted-foreground dark:hover:bg-muted/35"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Right: Search box */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-textMuted dark:text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl bg-background dark:bg-background/20 border-border focus-visible:ring-primary w-full text-sm"
              />
            </div>
          </div>

          {/* 3. Grid News List */}
          <div className="min-h-[400px]">
            {filteredArticles.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                <AnimatePresence>
                  {filteredArticles.map((article) => (
                    <motion.div
                      key={article.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      id={article.id}
                      className="scroll-mt-24"
                    >
                      <NewsCard article={article} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center font-sans gap-4">
                <p className="text-textMuted dark:text-muted-foreground text-base">
                  Tidak ditemukan berita yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
                </p>
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="rounded-xl gap-2 border-primary text-primary hover:bg-primary/5 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset Filter Pencarian</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
