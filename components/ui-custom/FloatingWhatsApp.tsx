"use client";

import * as React from "react";
import { MessageSquare, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { villageProfile } from "@/data/village";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = React.useState(false);

  React.useEffect(() => {
    if (pathname?.startsWith("/dashboard")) {
      return;
    }
    // Show tooltip after 3 seconds
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* WhatsApp Tooltip / Greeting */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="relative max-w-xs rounded-xl bg-cardSoft p-3.5 shadow-lg border border-orinoco text-textMain text-xs font-medium dark:bg-card dark:text-foreground dark:border-border"
          >
            {/* Close tooltip button */}
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm"
              aria-label="Close tooltip"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="flex gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse mt-1 shrink-0" />
              <div>
                <p className="font-bold">Layanan Digital Desa</p>
                <p className="text-[11px] text-textMuted dark:text-muted-foreground mt-0.5 leading-relaxed">
                  Ada pertanyaan tentang pengurusan surat? Hubungi kami langsung di WhatsApp.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.a
        href={`https://wa.me/${villageProfile.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba5a] transition-colors focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-950"
        aria-label="Contact Village via WhatsApp"
        onClick={() => setShowTooltip(false)}
      >
        <MessageSquare className="h-7 w-7 fill-white text-[#25D366]" />
      </motion.a>
    </div>
  );
}
