"use client";

import React, { useEffect, useState } from "react";
import { Check, ShieldAlert, MapPin, Compass, Droplet, TreeDeciduous, Hammer } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import { MapEmbed } from "@/components/ui-custom/MapEmbed";
import { villageProfile as defaultProfile } from "@/data/village";
import { createClient } from "@/utils/supabase/client";

export default function ProfilPage() {
  const breadcrumbs = [{ label: "Profil Desa" }];
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("village_profile")
          .select("*")
          .maybeSingle();
        if (data && !error) {
          setProfile(data);
        }
      } catch (e) {
        console.error("Gagal memuat profil desa dari Supabase:", e);
      }
    }
    loadProfile();
  }, []);

  const data = profile || {
    name: defaultProfile.name,
    district: defaultProfile.district,
    history: defaultProfile.history,
    vision: defaultProfile.vision,
    mission: defaultProfile.mission,
    geographic: defaultProfile.geographic,
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* 1. Page Hero Banner */}
      <PageHero
        title={`Profil Desa ${data.name}`}
        description={`Kenali lebih dekat sejarah, visi, misi, letak geografis, dan kondisi umum Desa ${data.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Sejarah Desa */}
      <section className="py-16 md:py-24 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            <div className="lg:col-span-7 flex flex-col gap-5">
              <span className="text-xs uppercase tracking-widest font-bold text-primary font-sans">
                Asal Usul Desa
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-textMain dark:text-foreground">
                Sejarah Desa {data.name}
              </h2>
              <div className="h-1 w-16 bg-primary rounded-full" />
              <p className="text-sm sm:text-base text-textMuted dark:text-muted-foreground leading-relaxed font-sans mt-2">
                {data.history}
              </p>
              <p className="text-sm sm:text-base text-textMuted dark:text-muted-foreground leading-relaxed font-sans">
                Sejak berdirinya, para perintis desa bersama warga bahu-membahu membuka akses jalan perkebunan, mendirikan sarana ibadah, dan menyusun tata tertib sosial. Keberhasilan mempertahankan persatuan dan semangat gotong-royong inilah yang kini mengantarkan Desa {data.name} berkembang menjadi kawasan yang maju di Kecamatan {data.district}.
              </p>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-orinoco/30 dark:border-border/60 aspect-[4/3] p-1 bg-cardSoft">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800"
                  alt="Suasana alam pedesaan"
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Visi & Misi */}
      <section className="py-16 md:py-24 bg-cardSoft dark:bg-card/30 border-y border-orinoco/20 dark:border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Visi */}
            <div className="lg:col-span-5 flex flex-col gap-5 bg-primary text-primary-foreground p-8 rounded-3xl shadow-lg border border-primary/20 justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eggshell/10 border border-eggshell/20 mb-2">
                <ShieldAlert className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xs uppercase tracking-widest font-bold text-primary-foreground/80 font-sans">
                Visi Desa
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-primary-foreground leading-tight">
                &ldquo;{data.vision}&rdquo;
              </h3>
            </div>

            {/* Misi */}
            <div className="lg:col-span-7 flex flex-col gap-5 justify-center">
              <span className="text-xs uppercase tracking-widest font-bold text-primary font-sans">
                Misi Desa
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-textMain dark:text-foreground">
                Langkah Strategis Pembangunan
              </h3>
              <div className="h-1 w-16 bg-primary rounded-full mb-3" />
              
              <ul className="flex flex-col gap-4">
                {(() => {
                  const val = data.mission;
                  if (!val) return <li className="text-xs text-textMuted italic">Misi desa belum dikonfigurasikan.</li>;
                  
                  const missions = (() => {
                    if (Array.isArray(val)) return val;
                    if (typeof val === "string") {
                      const trimmed = val.trim();
                      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                        try {
                          const parsed = JSON.parse(trimmed);
                          if (Array.isArray(parsed)) return parsed;
                        } catch {}
                      }
                      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
                        const content = trimmed.slice(1, -1);
                        const items: string[] = [];
                        let current = "";
                        let inQuotes = false;
                        for (let i = 0; i < content.length; i++) {
                          const char = content[i];
                          if (char === '"') {
                            inQuotes = !inQuotes;
                          } else if (char === ',' && !inQuotes) {
                            items.push(current.trim());
                            current = "";
                          } else {
                            current += char;
                          }
                        }
                        if (current) items.push(current.trim());
                        return items.filter(Boolean);
                      }
                      if (trimmed.includes("\n")) {
                        return trimmed.split("\n").map(m => m.trim()).filter(Boolean);
                      }
                      if (trimmed.includes(";")) {
                        return trimmed.split(";").map(m => m.trim()).filter(Boolean);
                      }
                      return [trimmed];
                    }
                    return [];
                  })();

                  if (missions.length === 0) {
                    return <li className="text-xs text-textMuted italic">Misi desa belum dikonfigurasikan.</li>;
                  }

                  return missions.map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-3 items-start text-sm sm:text-base text-textMuted dark:text-muted-foreground font-sans leading-relaxed">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-accent-foreground mt-0.5 font-bold text-xs">
                        {idx + 1}
                      </div>
                      <span>{item}</span>
                    </li>
                  ));
                })()}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Letak Geografis, Batas Wilayah, Luas Wilayah */}
      <section className="py-16 md:py-24 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Kondisi Wilayah"
            title="Letak Geografis & Batas Wilayah"
            description={`Informasi mengenai batas-batas teritorial, luas daerah, serta tata guna lahan Desa ${data.name}.`}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {/* Luas Wilayah */}
            <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm flex flex-col justify-between">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-textMain dark:text-foreground">
                  Luas & Kontur
                </h3>
                <p className="text-sm text-textMuted dark:text-muted-foreground font-sans leading-relaxed">
                  Wilayah Desa {data.name} membentang seluas <strong className="text-textMain dark:text-foreground font-semibold">{data.geographic?.area || data.area_size || "425 Ha"}</strong>. Sebagian besar berupa dataran tinggi yang sangat potensial untuk perkebunan dan pertanian.
                </p>
                <div className="mt-4 bg-background/50 dark:bg-background/20 p-4 rounded-xl border border-orinoco/20 font-sans text-xs">
                  <span className="font-bold text-textMain dark:text-foreground block mb-1">Topografi Wilayah:</span>
                  <span className="text-textMuted dark:text-muted-foreground">{data.geographic?.topography || data.geography || "Kawasan pesisir dan dataran rendah."}</span>
                </div>
              </CardContent>
            </Card>

            {/* Batas Teritorial */}
            <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm lg:col-span-2">
              <CardContent className="p-6 flex flex-col gap-4 h-full justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-textMain dark:text-foreground mt-2">
                    Batas-Batas Wilayah
                  </h3>
                  <p className="text-sm text-textMuted dark:text-muted-foreground font-sans leading-relaxed">
                    Secara administrasi kewilayahan, batas-batas geografis Desa {data.name} berbatasan langsung dengan:
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-xl bg-background/60 dark:bg-background/20 border border-orinoco/20 font-sans text-sm flex justify-between items-center">
                    <div>
                      <span className="text-xs uppercase font-bold text-textMuted dark:text-muted-foreground block">Batas Utara</span>
                      <span className="font-semibold text-textMain dark:text-foreground mt-1 block">{data.geographic?.borders?.north || data.north_boundary || "-"}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-background/60 dark:bg-background/20 border border-orinoco/20 font-sans text-sm flex justify-between items-center">
                    <div>
                      <span className="text-xs uppercase font-bold text-textMuted dark:text-muted-foreground block">Batas Selatan</span>
                      <span className="font-semibold text-textMain dark:text-foreground mt-1 block">{data.geographic?.borders?.south || data.south_boundary || "-"}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-background/60 dark:bg-background/20 border border-orinoco/20 font-sans text-sm flex justify-between items-center">
                    <div>
                      <span className="text-xs uppercase font-bold text-textMuted dark:text-muted-foreground block">Batas Timur</span>
                      <span className="font-semibold text-textMain dark:text-foreground mt-1 block">{data.geographic?.borders?.east || data.east_boundary || "-"}</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-background/60 dark:bg-background/20 border border-orinoco/20 font-sans text-sm flex justify-between items-center">
                    <div>
                      <span className="text-xs uppercase font-bold text-textMuted dark:text-muted-foreground block">Batas Barat</span>
                      <span className="font-semibold text-textMain dark:text-foreground mt-1 block">{data.geographic?.borders?.west || data.west_boundary || "-"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Potensi Umum Desa */}
      <section className="py-16 md:py-24 bg-cardSoft dark:bg-card/20 border-t border-orinoco/10 dark:border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Kekayaan Alam & Budaya"
            title={`Potensi Umum Desa ${data.name}`}
            description="Gambaran singkat mengenai aset alam, industri rakyat, dan agrobisnis utama yang menopang kehidupan warga desa."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 font-sans">
            <Card className="border border-orinoco/30 dark:border-border/60 bg-background dark:bg-card shadow-sm p-6 flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <TreeDeciduous className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-textMain dark:text-foreground">Agrobisnis Durian & Kopi</h3>
              <p className="text-xs text-textMuted dark:text-muted-foreground leading-relaxed">
                Lereng subur kaki Gunung Tampomas dimanfaatkan secara luas untuk perkebunan durian bawor unggul serta kopi robusta, memberikan komoditas bernilai jual tinggi bagi petani lokal.
              </p>
            </Card>

            <Card className="border border-orinoco/30 dark:border-border/60 bg-background dark:bg-card shadow-sm p-6 flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Droplet className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-textMain dark:text-foreground">Sumber Air Alami Cikuda</h3>
              <p className="text-xs text-textMuted dark:text-muted-foreground leading-relaxed">
                Kelimpahan air bersih dari mata air alami pegunungan Cikuda menopang kebutuhan rumah tangga harian, budidaya perikanan air tawar kolam air deras, serta sistem pengairan sawah warga.
              </p>
            </Card>

            <Card className="border border-orinoco/30 dark:border-border/60 bg-background dark:bg-card shadow-sm p-6 flex flex-col gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Hammer className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-textMain dark:text-foreground">Kriya Anyaman Bambu</h3>
              <p className="text-xs text-textMuted dark:text-muted-foreground leading-relaxed">
                Kreativitas mengolah bambu menjadi berbagai jenis perabot dapur tradisional dan anyaman seni rupa dekorasi rumah menjadi roda penggerak industri rumah tangga lokal yang andal.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. Peta Kantor Desa */}
      <section className="py-16 md:py-24 bg-eggshell dark:bg-background border-t border-orinoco/10 dark:border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            label="Kunjungi Kantor Kami"
            title={`Peta Lokasi Kantor Desa ${data.name}`}
            description="Temukan koordinat resmi pusat pemerintahan pelayanan administrasi warga Desa Citimun."
          />
          <MapEmbed height={400} />
        </div>
      </section>
    </div>
  );
}
