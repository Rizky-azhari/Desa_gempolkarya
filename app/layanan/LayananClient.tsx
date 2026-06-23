"use client";

import React, { useState, useEffect } from "react";
import { FileText, Users, HeartHandshake, Info } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { villageProfile } from "@/data/village";
import { publicServices } from "@/data/services";
import { createClient } from "@/utils/supabase/client";

export default function LayananClient() {
  const breadcrumbs = [{ label: "Layanan Publik" }];
  const [services, setServices] = useState<any[]>(publicServices);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });
        if (data && !error) {
          setServices(data.map(s => ({
            id: s.id,
            title: s.title,
            description: s.description || "",
            duration: s.estimated_time || "-",
            cost: s.cost || "Gratis",
            category: s.category || "Administrasi",
            requirements: s.requirements || [],
            slug: s.slug
          })));
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  // Categories list
  const categories = [
    { value: "all", label: "Semua Layanan", icon: <Info className="h-4 w-4 shrink-0" /> },
    { value: "Administrasi", label: "Administrasi", icon: <FileText className="h-4 w-4 shrink-0" /> },
    { value: "Kependudukan", label: "Kependudukan", icon: <Users className="h-4 w-4 shrink-0" /> },
    { value: "Kesejahteraan", label: "Kesejahteraan", icon: <HeartHandshake className="h-4 w-4 shrink-0" /> },
  ];

  const getFilteredServices = (category: string) => {
    if (category === "all") return services;
    return services.filter((s) => s.category === category);
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* 1. Hero Banner */}
      <PageHero
        title="Layanan Publik Online"
        description={`Persyaratan administrasi pengurusan surat keterangan, kependudukan, dan bantuan sosial di Desa ${villageProfile.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Services List with Tabs Filter */}
      <section className="py-16 md:py-24 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Persyaratan Administrasi"
            title="Daftar Pengurusan Surat Keterangan"
            description="Pilih kategori surat yang Anda butuhkan di bawah ini untuk melihat persyaratan lengkap dokumen dan estimasi penyelesaian."
          />

          <Tabs defaultValue="all" className="w-full mt-4 flex flex-col items-center">
            {/* Tabs Trigger Header */}
            <TabsList className="bg-cardSoft dark:bg-card border border-orinoco/40 dark:border-border/60 rounded-2xl p-1 mb-10 overflow-x-auto max-w-full flex justify-start sm:justify-center gap-1 font-sans">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-textMuted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tabs Contents */}
            {categories.map((cat) => (
              <TabsContent key={cat.value} value={cat.value} className="w-full outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {getFilteredServices(cat.value).length > 0 ? (
                    getFilteredServices(cat.value).map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-textMuted dark:text-muted-foreground font-sans">
                      Layanan kategori ini belum tersedia. Silakan hubungi kantor desa untuk informasi lebih lanjut.
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* 3. General Information Alert */}
      <section className="py-12 bg-cardSoft dark:bg-card/30 border-t border-orinoco/10 dark:border-border/30 font-sans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent-foreground font-bold">
              i
            </div>
            <div>
              <h4 className="text-base font-bold text-textMain dark:text-foreground">Informasi Penting Terkait Pelayanan</h4>
              <p className="text-sm text-textMuted dark:text-muted-foreground leading-relaxed mt-1">
                Seluruh pelayanan administrasi di Kantor Desa {villageProfile.name} dilakukan secara **GRATIS** tanpa dipungut biaya apapun. Pastikan Anda membawa semua persyaratan dokumen asli dan fotokopi yang dibutuhkan saat melakukan validasi akhir di kantor desa demi kelancaran proses pengurusan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
