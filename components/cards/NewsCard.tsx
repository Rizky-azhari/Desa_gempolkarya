"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { NewsItem } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";

interface NewsCardProps {
  article: NewsItem;
}

export function NewsCard({ article }: NewsCardProps) {
  const getStatusType = (cat: typeof article.category) => {
    switch (cat) {
      case "Berita Utama":
        return "danger";
      case "Pengumuman":
        return "warning";
      case "Pembangunan":
        return "success";
      case "Kegiatan":
        return "info";
      default:
        return "neutral";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full flex"
    >
      <Card className="overflow-hidden border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card flex flex-col justify-between w-full shadow-sm hover:shadow-md transition-shadow duration-300">
        <div>
          {/* Card Header with Image */}
          <CardHeader className="p-0 relative h-48 w-full overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
            <div className="absolute top-3 left-3 z-10">
              <StatusBadge status={getStatusType(article.category)}>
                {article.category}
              </StatusBadge>
            </div>
          </CardHeader>

          {/* Card Content */}
          <CardContent className="p-5 flex flex-col gap-3">
            {/* Meta data */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-textMuted dark:text-muted-foreground font-sans">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(article.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {article.author}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-heading text-lg font-bold leading-snug text-textMain dark:text-foreground line-clamp-2 hover:text-primary transition-colors">
              <Link href={`/berita/${article.id}`}>{article.title}</Link>
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-textMuted dark:text-muted-foreground font-sans line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>
          </CardContent>
        </div>

        {/* Card Footer */}
        <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center border-t border-orinoco/10 dark:border-border/30 mt-4">
          <span className="flex items-center gap-1 text-xs text-textMuted dark:text-muted-foreground font-sans">
            <Clock className="h-3.5 w-3.5" />
            {article.readTime}
          </span>
          <Link
            href={`/berita/${article.id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors font-sans group"
          >
            Baca Selengkapnya
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
