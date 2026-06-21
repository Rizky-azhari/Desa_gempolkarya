import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User, Clock, TreePine } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import { villageProfile } from "@/data/village";
import { createClient } from "@/utils/supabase/server";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Try to find by slug first, then by id as fallback
  let dbArticle: any = null;

  const { data: bySlug } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (bySlug) {
    dbArticle = bySlug;
  } else {
    // Fallback: try matching by id (UUID)
    const { data: byId } = await supabase
      .from("news")
      .select("*")
      .eq("id", slug)
      .eq("status", "published")
      .maybeSingle();
    dbArticle = byId ?? null;
  }

  if (!dbArticle) {
    notFound();
  }

  const article = {
    id: dbArticle.id,
    title: dbArticle.title,
    category: dbArticle.category,
    excerpt: dbArticle.excerpt || "",
    content: dbArticle.content || "",
    image: dbArticle.image_url || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    date: dbArticle.published_at || dbArticle.created_at,
    author: "Admin Desa",
    readTime: "5 Menit"
  };

  const breadcrumbs = [
    { label: "Berita & Kegiatan", href: "/berita" },
    { label: article.title },
  ];

  const getStatusType = (cat: typeof article.category) => {
    switch (cat) {
      case "Berita Utama":
        return "danger";
      case "Pengumuman":
        return "warning";
      case "Pembangunan":
        return "success";
      case "Kegiatan":
      default:
        return "info";
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* 1. Page Hero Banner */}
      <PageHero
        title={article.title}
        description={`Kategori: ${article.category} — Diposkan oleh ${article.author}`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Article Details */}
      <section className="py-16 bg-eggshell dark:bg-background font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          {/* Back button */}
          <Link
            href="/berita"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Kembali ke Daftar Berita
          </Link>

          {/* Article Header block */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-2">
              <StatusBadge status={getStatusType(article.category)}>
                {article.category}
              </StatusBadge>
            </div>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-textMuted dark:text-muted-foreground border-y border-orinoco/20 dark:border-border/30 py-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-smoke" />
                {new Date(article.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-smoke" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-smoke" />
                {article.readTime} Baca
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-orinoco/30 dark:border-border/60 aspect-[16/9] mb-10">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Rich Content paragraphs */}
          <div className="text-sm sm:text-base text-textMain dark:text-foreground leading-relaxed flex flex-col gap-6 max-w-none">
            <p className="font-semibold text-base sm:text-lg text-primary leading-relaxed">
              {article.excerpt}
            </p>
            <p>
              {article.content}
            </p>
            <p>
              Pemerintah Desa {villageProfile.name} senantiasa mengedepankan sinergi warga dan keterbukaan informasi. Kegiatan ini diharapkan mampu mendorong partisipasi aktif masyarakat dalam mensukseskan arah pembangunan desa yang Maju, Hijau, Mandiri, dan Melayani di Kecamatan {villageProfile.district}, Kabupaten {villageProfile.regency}.
            </p>
            <p>
              Untuk informasi lebih lanjut mengenai program ini atau jika terdapat hal-hal administratif yang ingin dikonsultasikan, silakan datang langsung ke Kantor Desa {villageProfile.name} pada jam operasional pelayanan atau hubungi nomor layanan informasi desa yang tersedia di halaman kontak.
            </p>
          </div>

          {/* Share block */}
          <div className="border-t border-orinoco/20 dark:border-border/40 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-textMuted dark:text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <TreePine className="h-4 w-4 text-primary" /> Rilis resmi Pemerintah Desa {villageProfile.name}
            </span>
            <div className="flex gap-4">
              <span>Bagikan berita:</span>
              <a href="#" className="hover:underline hover:text-primary">WhatsApp</a>
              <a href="#" className="hover:underline hover:text-primary">Facebook</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
