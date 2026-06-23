"use client";

import React, { useEffect, useState } from "react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { StatSummary } from "@/components/dashboard/StatSummary";
import { StatCharts } from "@/components/charts/StatCharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Heart } from "lucide-react";
import { villageProfile } from "@/data/village";
import {
  getVillageStats,
  getDemographicStats,
  getReligionStats,
  VillageStats,
  ReligionStat,
} from "@/lib/demographics";
import { DemographicData } from "@/types";

export default function DataDesaClient() {
  const breadcrumbs = [{ label: "Data Desa" }];
  
  const [villageStats, setVillageStats] = useState<VillageStats | null>(null);
  const [demoStats, setDemoStats] = useState<DemographicData | null>(null);
  const [religionStats, setReligionStats] = useState<ReligionStat[]>([]);

  useEffect(() => {
    async function loadStats() {
      const vStats = await getVillageStats();
      const dStats = await getDemographicStats();
      const rStats = await getReligionStats();
      setVillageStats(vStats);
      setDemoStats(dStats);
      setReligionStats(rStats);
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

  // Safe fallbacks
  const currentStats = villageStats || {
    population: "4.826 jiwa",
    households: "1.392 KK",
    rtCount: 24,
    rwCount: 8,
    areaSize: "425 Ha",
  };

  const currentDemo = demoStats || {
    gender: [
      { name: "Laki-laki", value: 2431, percentage: "50.4%" },
      { name: "Perempuan", value: 2395, percentage: "49.6%" }
    ],
    education: [],
    job: [],
    ageGroup: []
  };

  const currentReligion = religionStats.length > 0 ? religionStats : [
    { name: "Islam", count: 4792, percentage: "99.30%" },
    { name: "Kristen Protestan", count: 24, percentage: "0.50%" },
    { name: "Katolik", count: 10, percentage: "0.20%" },
    { name: "Hindu", count: 0, percentage: "0.00%" },
    { name: "Buddha", count: 0, percentage: "0.00%" },
    { name: "Konghucu", count: 0, percentage: "0.00%" },
  ];

  // Calculate density: population number / areaSize number
  const popVal = parseFloat(currentStats.population.replace(/[^0-9]/g, "")) || 0;
  const areaVal = parseFloat(currentStats.areaSize.replace(/[^0-9]/g, "")) || 425;
  const density = areaVal > 0 ? (popVal / areaVal).toFixed(1) : "0";

  // Gender counts
  const maleObj = currentDemo.gender.find(g => g.name.toLowerCase() === "laki-laki" || g.name.toLowerCase() === "pria");
  const femaleObj = currentDemo.gender.find(g => g.name.toLowerCase() === "perempuan" || g.name.toLowerCase() === "wanita");
  
  const maleCount = maleObj ? `${maleObj.value.toLocaleString()} jiwa` : "0 jiwa";
  const malePct = maleObj ? `Rasio ${maleObj.percentage}` : "0%";
  
  const femaleCount = femaleObj ? `${femaleObj.value.toLocaleString()} jiwa` : "0 jiwa";
  const femalePct = femaleObj ? `Rasio ${femaleObj.percentage}` : "0%";

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* 1. Page Hero */}
      <PageHero
        title="Statistik & Data Desa"
        description={`Transparansi data statistik kependudukan, tingkat pendidikan, mata pencaharian, dan demografi resmi Desa ${villageProfile.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Stat Summary Counters */}
      <section className="py-16 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Informasi Demografi"
            title={`Ringkasan Kependudukan ${villageProfile.name}`}
            description="Angka aggregat resmi hasil pemutakhiran data sensus penduduk dan kepala keluarga."
          />
          <StatSummary />
        </div>
      </section>

      {/* 3. Recharts Visualizations */}
      <section className="py-12 md:py-16 bg-cardSoft dark:bg-card/20 border-t border-orinoco/10 dark:border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Grafik Statistik"
            title="Visualisasi Data Kependudukan"
            description="Grafik interaktif Recharts menggambarkan sebaran rasio gender, tingkat pendidikan, profesi, dan kelompok usia."
          />
          <StatCharts />
        </div>
      </section>

      {/* 4. Tabular Summary (Tabel ringkasan demografi) & Data Agama */}
      <section className="py-16 bg-eggshell dark:bg-background font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Demographics Summary Table */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-cardSoft dark:bg-card border border-orinoco/30 dark:border-border/60 rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-textMain dark:text-foreground mb-1 flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  Tabel Ringkasan Demografi
                </h3>
                <p className="text-xs text-textMuted dark:text-muted-foreground mb-4">
                  Rangkuman data kependudukan resmi untuk kepentingan analisis pembangunan wilayah.
                </p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="font-bold">Indikator Kependudukan</TableHead>
                        <TableHead className="text-right font-bold">Jumlah / Data</TableHead>
                        <TableHead className="text-right font-bold">Keterangan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold text-textMain dark:text-foreground">Total Penduduk</TableCell>
                        <TableCell className="text-right font-mono font-medium">{currentStats.population}</TableCell>
                        <TableCell className="text-right text-xs text-textMuted dark:text-muted-foreground">Warga Terdaftar</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-textMain dark:text-foreground">Total Kepala Keluarga (KK)</TableCell>
                        <TableCell className="text-right font-mono font-medium">{currentStats.households}</TableCell>
                        <TableCell className="text-right text-xs text-textMuted dark:text-muted-foreground">Kartu Keluarga Aktif</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-textMain dark:text-foreground">Penduduk Laki-laki</TableCell>
                        <TableCell className="text-right font-mono font-medium">{maleCount}</TableCell>
                        <TableCell className="text-right text-xs text-textMuted dark:text-muted-foreground">{malePct}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-textMain dark:text-foreground">Penduduk Perempuan</TableCell>
                        <TableCell className="text-right font-mono font-medium">{femaleCount}</TableCell>
                        <TableCell className="text-right text-xs text-textMuted dark:text-muted-foreground">{femalePct}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-textMain dark:text-foreground">Kepadatan Wilayah</TableCell>
                        <TableCell className="text-right font-mono font-medium">{density} jiwa / Ha</TableCell>
                        <TableCell className="text-right text-xs text-textMuted dark:text-muted-foreground">Total Area {currentStats.areaSize}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold text-textMain dark:text-foreground">Struktur Pembagian RT/RW</TableCell>
                        <TableCell className="text-right font-mono font-medium">{currentStats.rtCount} RT / {currentStats.rwCount} RW</TableCell>
                        <TableCell className="text-right text-xs text-textMuted dark:text-muted-foreground">{currentStats.rwCount} Rukun Warga</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Right: Religion statistics (Data Agama) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-cardSoft dark:bg-card border border-orinoco/30 dark:border-border/60 rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading text-lg font-bold text-textMain dark:text-foreground mb-1 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Data Keragaman Agama
                </h3>
                <p className="text-xs text-textMuted dark:text-muted-foreground mb-4">
                  Kerukunan umat beragama di Desa {villageProfile.name} terjalin harmonis dengan rincian pemeluk keyakinan:
                </p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="font-bold">Agama / Keyakinan</TableHead>
                        <TableHead className="text-right font-bold">Pemeluk (Jiwa)</TableHead>
                        <TableHead className="text-right font-bold">Persentase</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentReligion.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-semibold text-textMain dark:text-foreground">{item.name}</TableCell>
                          <TableCell className="text-right font-mono text-xs text-textMuted dark:text-muted-foreground">{item.count.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-semibold text-xs text-primary">{item.percentage}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
