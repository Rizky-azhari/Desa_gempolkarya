"use client";

import { cn } from "@/lib/utils";
import { villageProfile } from "@/data/village";

interface MapEmbedProps {
  url?: string;
  className?: string;
  height?: string | number;
}

export function MapEmbed({ url = villageProfile.mapEmbedUrl, className, height = "450px" }: MapEmbedProps) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl overflow-hidden shadow-lg border border-orinoco/40 dark:border-border/60 bg-cardSoft dark:bg-card p-2 transition-all duration-300 hover:shadow-xl",
        className
      )}
    >
      <iframe
        src={url}
        width="100%"
        height={height}
        style={{ border: 0, borderRadius: "12px" }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Peta Lokasi Desa"
        className="w-full grayscale contrast-[0.95] brightness-[0.95] dark:invert dark:grayscale-0 dark:contrast-100 transition-all duration-500 hover:grayscale-0 dark:hover:invert-0"
      />
    </div>
  );
}
