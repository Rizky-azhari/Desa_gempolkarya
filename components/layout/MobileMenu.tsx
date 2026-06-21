"use client";

import * as React from "react";
import Link from "next/link";
import { X, TreePine, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { villageProfile } from "@/data/village";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
  navItems: { label: string; href: string }[];
}

export function MobileMenu({ isOpen, onClose, pathname, navItems }: MobileMenuProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Menu Content */}
      <div className="relative ml-auto flex h-full w-[280px] max-w-sm flex-col bg-background p-6 shadow-2xl transition-transform duration-300 ease-in-out border-l border-border/50">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TreePine className="h-5 w-5 text-eggshell dark:text-background" />
            </div>
            <span className="font-heading text-base font-bold text-textMain dark:text-foreground">
              Desa {villageProfile.name}
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-lg h-9 w-9 text-textMuted hover:text-textMain dark:text-muted-foreground dark:hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-2 mt-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-textMuted hover:bg-muted/50 hover:text-textMain dark:text-muted-foreground dark:hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border/50 pt-6">
          <p className="text-xs text-textMuted dark:text-muted-foreground text-center mb-4">
            Butuh bantuan administrasi?
          </p>
          <Button asChild className="w-full gap-2 rounded-xl">
            <a
              href={`https://wa.me/${villageProfile.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <Phone className="h-4 w-4" />
              <span>WhatsApp Layanan</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
