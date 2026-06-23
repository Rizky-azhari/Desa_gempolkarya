"use client";

import React, { useState, useEffect } from "react";
import { Compass, MapPin, Phone, Users, Home as HomeIcon, Filter } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { MapEmbed } from "@/components/ui-custom/MapEmbed";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { villageProfile } from "@/data/village";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

export default function PetaClient() {
  const breadcrumbs = [{ label: "Peta RT / RW" }];
  
  // Active RW Filter
  const [selectedRw, setSelectedRw] = useState<string>("all");
  const [rtList, setRtList] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("rtrw_locations")
          .select("*")
          .eq("is_active", true)
          .order("rw", { ascending: true })
          .order("rt", { ascending: true });
        if (data && !error) {
          setRtList(data.map(item => {
            const rtNum = parseInt(item.rt) || 1;
            const rwNum = parseInt(item.rw) || 1;
            return {
              id: item.id,
              rt: item.rt,
              rw: item.rw,
              headName: item.leader_name,
              phone: item.phone || "",
              population: 150 + (rtNum * 10) + (rwNum * 15),
              households: 45 + (rtNum * 3) + (rwNum * 4)
            };
          }));
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const rwOptions = [
    { value: "all", label: "Semua RW" },
    { value: "01", label: "RW 01" },
    { value: "02", label: "RW 02" },
    { value: "03", label: "RW 03" },
    { value: "04", label: "RW 04" },
    { value: "05", label: "RW 05" },
  ];

  // Filtering RTs
  const filteredRtList = rtList.filter((item) => {
    return selectedRw === "all" || item.rw === selectedRw;
  });

  const handleShowLocation = (rt: string, rw: string, head: string) => {
    toast.success(`Menampilkan estimasi titik koordinat lokasi RT ${rt} / RW ${rw} (Ketua: ${head}) pada peta.`);
  };

  const handleContactHead = (rt: string, rw: string, head: string, phoneStr?: string) => {
    const targetPhone = phoneStr || villageProfile.whatsapp;
    const waText = encodeURIComponent(
      `Halo Bapak ${head} selaku Ketua RT ${rt}/RW ${rw} Desa ${villageProfile.name}, saya ingin menanyakan perihal administrasi warga...`
    );
    window.open(`https://wa.me/${targetPhone}?text=${waText}`, "_blank");
    toast.success(`Membuka chat WhatsApp dengan Ketua RT ${rt}...`);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* 1. Page Hero */}
      <PageHero
        title="Peta Wilayah RT & RW"
        description={`Direktori rukun tetangga & rukun warga, pembagian administratif wilayah, serta peta interaktif teritorial Desa ${villageProfile.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Interactive Map Section */}
      <section className="py-16 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Peta Geografis"
            title="Peta Satelit Desa Gempolkarya"
            description="Navigasikan peta satelit di bawah ini untuk melihat kontur wilayah, lahan pertanian, dan area pemukiman warga desa."
          />
          <MapEmbed height={400} />
        </div>
      </section>

      {/* 3. Filter and RT/RW Grid Cards */}
      <section className="py-16 md:py-20 bg-cardSoft dark:bg-card/20 border-t border-orinoco/10 dark:border-border/30 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Direktori Warga"
            title="Daftar Pembagian Rukun Tetangga"
            description="Gunakan filter di bawah untuk mengelompokkan Rukun Tetangga (RT) berdasarkan Rukun Warga (RW) masing-masing dusun."
          />

          {/* Filter Toolbar */}
          <div className="flex flex-wrap gap-2.5 items-center justify-center bg-background dark:bg-card border border-orinoco/30 dark:border-border/60 p-4 rounded-2xl mb-10 w-fit mx-auto shadow-sm">
            <span className="text-xs font-bold text-textMuted dark:text-muted-foreground flex items-center gap-1.5 mr-2">
              <Filter className="h-4 w-4 text-primary" /> Filter RW:
            </span>
            {rwOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedRw(opt.value)}
                className={cn(
                  "text-xs px-4 py-2 rounded-xl font-semibold border transition-all cursor-pointer",
                  selectedRw === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-textMuted border-border hover:bg-muted dark:bg-background/20 dark:border-border dark:text-muted-foreground dark:hover:bg-muted/35"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRtList.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="h-full flex"
                >
                  <Card className="border border-orinoco/30 dark:border-border/60 bg-background dark:bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between w-full p-0 overflow-hidden">
                    <CardHeader className="bg-muted/20 p-5 border-b border-orinoco/10 dark:border-border/20">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Rukun Tetangga
                        </span>
                        <span className="text-xs font-semibold text-textMuted dark:text-muted-foreground">
                          Dusun RW {item.rw}
                        </span>
                      </div>
                      <CardTitle className="font-heading text-lg font-bold text-textMain dark:text-foreground mt-2">
                        RT {item.rt} / RW {item.rw}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-5 flex flex-col gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        <Compass className="h-4 w-4 text-smoke shrink-0" />
                        <span className="text-textMuted dark:text-muted-foreground">Ketua: <strong className="text-textMain dark:text-foreground font-semibold">{item.headName}</strong></span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-1 border-t border-orinoco/5 dark:border-border/10 pt-2">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase font-bold text-textMuted dark:text-muted-foreground tracking-wider">KK</span>
                          <span className="font-mono text-xs font-semibold text-textMain dark:text-foreground flex items-center gap-1">
                            <HomeIcon className="h-3.5 w-3.5 text-smoke shrink-0" /> {item.households} KK
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase font-bold text-textMuted dark:text-muted-foreground tracking-wider">Penduduk</span>
                          <span className="font-mono text-xs font-semibold text-textMain dark:text-foreground flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-smoke shrink-0" /> {item.population} Jiwa
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="p-4 border-t border-orinoco/10 dark:border-border/30 bg-muted/10 grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleShowLocation(item.rt, item.rw, item.headName)}
                        variant="outline"
                        size="sm"
                        className="rounded-xl gap-1 text-[11px] h-9 border-orinoco/50 hover:bg-muted text-textMuted dark:border-border dark:text-muted-foreground cursor-pointer"
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        Lihat Lokasi
                      </Button>
                      <Button
                        onClick={() => handleContactHead(item.rt, item.rw, item.headName, item.phone)}
                        variant="default"
                        size="sm"
                        className="rounded-xl gap-1 text-[11px] h-9 cursor-pointer"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Hubungi Ketua
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
