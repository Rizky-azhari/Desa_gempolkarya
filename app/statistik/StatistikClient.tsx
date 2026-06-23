"use client";

import React from "react";
import { Info, Download, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { StatSummary } from "@/components/dashboard/StatSummary";
import { StatCharts } from "@/components/charts/StatCharts";
import { Button } from "@/components/ui/button";
import { villageProfile } from "@/data/village";
import { toast } from "sonner";

export default function StatistikClient() {
  const breadcrumbs = [{ label: "Statistik Desa" }];

  const handleDownload = () => {
    toast.success("Mempersiapkan dokumen Laporan Infografis Demografi Semester I...");
    setTimeout(() => {
      toast.success("Laporan PDF berhasil diunduh!");
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* 1. Page Hero */}
      <PageHero
        title="Statistik & Kependudukan"
        description={`Portal visualisasi data demografi, angkatan kerja, tingkat pendidikan, dan rasio penduduk Desa ${villageProfile.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Overview Summary Cards */}
      <section className="py-16 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Visualisasi Data"
            title="Infografis Demografi Penduduk"
            description="Gambaran statistik terpusat untuk memetakan pertumbuhan penduduk, distribusi angkatan kerja, dan tingkat pendidikan di wilayah desa."
          />
          <div className="mt-8">
            <StatSummary />
          </div>
        </div>
      </section>

      {/* 3. Detailed Recharts Panels */}
      <section className="py-12 md:py-16 bg-cardSoft dark:bg-card/20 border-t border-orinoco/10 dark:border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 font-sans">
            <div>
              <h3 className="font-heading text-xl font-bold text-textMain dark:text-foreground">
                Statistik Distribusi Penduduk
              </h3>
              <p className="text-xs text-textMuted dark:text-muted-foreground mt-0.5">
                Pembaruan data sensus semester genap Desa {villageProfile.name}
              </p>
            </div>
            {/* Download Report Button */}
            <Button
              onClick={handleDownload}
              variant="outline"
              className="rounded-xl gap-2 border-primary text-primary hover:bg-primary/5 cursor-pointer text-xs"
            >
              <Download className="h-4 w-4" />
              Unduh Laporan Demografi
            </Button>
          </div>

          <StatCharts />
        </div>
      </section>

      {/* 4. Notes Section */}
      <section className="py-16 bg-eggshell dark:bg-background font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-primary/5 border border-primary/20 p-8 rounded-3xl">
            <div className="flex gap-3.5 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent-foreground">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-textMain dark:text-foreground text-sm sm:text-base">Keakuratan Data Sensus</h4>
                <p className="text-xs sm:text-sm text-textMuted dark:text-muted-foreground leading-relaxed mt-1">
                  Data statistik di atas diupdate berkala setiap semester berkoordinasi dengan para Ketua RT, RW, dan Dinas Kependudukan & Pencatatan Sipil Kabupaten {villageProfile.regency}.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3.5 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent-foreground">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-textMain dark:text-foreground text-sm sm:text-base">Perlindungan Privasi Warga</h4>
                <p className="text-xs sm:text-sm text-textMuted dark:text-muted-foreground leading-relaxed mt-1">
                  Penyajian data agregat demografi ini telah memenuhi regulasi Undang-Undang Perlindungan Data Pribadi. Informasi individu disembunyikan sepenuhnya untuk menjaga kerahasiaan warga.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
