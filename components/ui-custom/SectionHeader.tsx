"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col mb-10 md:mb-12",
        isCenter ? "items-center text-center mx-auto max-w-2xl" : "items-start text-left max-w-3xl",
        className
      )}
    >
      {/* Category Label */}
      {label && (
        <span className="text-xs uppercase tracking-widest font-bold text-primary mb-2.5 bg-primary/10 px-3 py-1 rounded-full dark:bg-primary/20 dark:text-accent-foreground">
          {label}
        </span>
      )}

      {/* Main Title */}
      <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-textMain dark:text-foreground">
        {title}
      </h2>

      {/* Elegant Line Divider */}
      <div
        className={cn(
          "h-1 w-16 bg-primary rounded-full mt-3.5 mb-4",
          isCenter ? "mx-auto" : "mr-auto"
        )}
      />

      {/* Description */}
      {description && (
        <p className="text-sm sm:text-base text-textMuted dark:text-muted-foreground leading-relaxed font-sans">
          {description}
        </p>
      )}
    </div>
  );
}
