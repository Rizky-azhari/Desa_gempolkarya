"use client";

import React, { useEffect, useState } from "react";
import { Users, Home, Map, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getVillageStats, VillageStats } from "@/lib/demographics";

export function StatSummary() {
  const [stats, setStats] = useState<VillageStats | null>(null);

  useEffect(() => {
    async function loadStats() {
      const data = await getVillageStats();
      setStats(data);
    }
    loadStats();
    
    const handleStorageChange = () => {
      loadStats();
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-stats-updated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-stats-updated", handleStorageChange);
    };
  }, []);

  // Default fallback values
  const currentStats = stats || {
    population: "4.826 jiwa",
    households: "1.392 KK",
    rtCount: 24,
    rwCount: 8,
    areaSize: "425 Ha",
  };

  const mainSummaryCards = [
    { label: "Total Penduduk", value: currentStats.population, desc: "Jiwa terdaftar", trend: "+1.4% thn ini" },
    { label: "Jumlah KK", value: currentStats.households, desc: "Kepala Keluarga", trend: `Rata-rata ${(parseFloat(currentStats.population.replace(/[^0-9]/g, "")) / parseFloat(currentStats.households.replace(/[^0-9]/g, ""))).toFixed(1)} jiwa/KK` },
    { label: "Luas Wilayah", value: currentStats.areaSize, desc: "Pertanian & Pemukiman", trend: "Hawa sejuk pesisir" },
    { label: "Rukun Tangga", value: `${currentStats.rtCount} RT / ${currentStats.rwCount} RW`, desc: "Unit Kewilayahan", trend: `${currentStats.rwCount} RW Administratif` }
  ];

  const getIcon = (label: string) => {
    switch (label) {
      case "Total Penduduk":
        return <Users className="h-5 w-5 text-primary" />;
      case "Jumlah KK":
        return <Home className="h-5 w-5 text-primary" />;
      case "Luas Wilayah":
        return <Map className="h-5 w-5 text-primary" />;
      default:
        return <ClipboardList className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {mainSummaryCards.map((item, idx) => (
        <Card
          key={idx}
          className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm hover:shadow-md transition-shadow"
        >
          <CardContent className="p-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
              {getIcon(item.label)}
            </div>
            <div className="flex flex-col gap-1 overflow-hidden">
              <span className="text-xs font-semibold text-textMuted dark:text-muted-foreground uppercase tracking-wider font-sans">
                {item.label}
              </span>
              <span className="font-heading text-2xl md:text-3xl font-extrabold text-textMain dark:text-foreground tracking-tight leading-none">
                {item.value}
              </span>
              <span className="text-xs text-textMuted dark:text-muted-foreground font-sans truncate">
                {item.desc}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-sans mt-0.5">
                {item.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

