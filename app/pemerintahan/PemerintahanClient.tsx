"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, Users, Table, ClipboardList, Phone } from "lucide-react";
import { PageHero } from "@/components/ui-custom/PageHero";
import { SectionHeader } from "@/components/ui-custom/SectionHeader";
import { StaffCard } from "@/components/cards/StaffCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table as UiTable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { villageProfile } from "@/data/village";
import { Button } from "@/components/ui/button";
import { staffList } from "@/data/officials";

import { createClient } from "@/utils/supabase/client";

const initialOfficials = staffList.map(o => ({
  id: o.id,
  name: o.name,
  role: o.role,
  photo: o.photo || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500",
  phone: o.phone || "",
  email: o.email || "",
  nip: o.nip || "",
  category: o.category || (o.role.includes("Kepala Dusun") ? "Kewilayahan" : "Perangkat")
}));

export default function PemerintahanClient() {
  const [officials, setOfficials] = useState<any[]>(initialOfficials);
  const [rtrw, setRtrw] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        
        // 1. Fetch officials
        const { data: offData, error: offError } = await supabase
          .from("officials")
          .select("*")
          .order("sort_order", { ascending: true });
        
        if (offData && !offError) {
          setOfficials(offData.map(o => ({
            id: o.id,
            name: o.name,
            role: o.position,
            photo: o.photo_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500",
            phone: o.phone || "",
            email: o.email || "",
            nip: o.nip || "",
            category: o.category || "Perangkat"
          })));
        }

        // 2. Fetch RT/RW locations
        const { data: rtrwData, error: rtrwError } = await supabase
          .from("rtrw_locations")
          .select("*")
          .order("rw", { ascending: true })
          .order("rt", { ascending: true });

        if (rtrwData && !rtrwError) {
          setRtrw(rtrwData.map(r => ({
            id: r.id,
            rt: r.rt,
            rw: r.rw,
            headName: r.leader_name,
            phone: r.phone || "",
            households: 50 + (parseInt(r.rt || "0") * 3 + parseInt(r.rw || "0") * 2) % 15,
            population: 170 + (parseInt(r.rt || "0") * 11 + parseInt(r.rw || "0") * 7) % 50
          })));
        }
      } catch (err) {
        console.error("Gagal memuat data pemerintahan:", err);
      }
    }

    loadData();
  }, []);

  const breadcrumbs = [{ label: "Pemerintahan" }];

  // Categorize staff
  const kades = officials.find((o) => o.role === "Kepala Desa");
  const sekdes = officials.find((o) => o.role === "Sekretaris Desa");
  
  const kaurKasi = officials.filter(
    (o) => o.category === "Perangkat" && o.role !== "Kepala Desa" && o.role !== "Sekretaris Desa"
  );
  const kadus = officials.filter((o) => o.category === "Kewilayahan");
  const staffLain = officials.filter((o) => o.category === "Lembaga");

  // Informational RW list (8 RWs)
  const rwList = [
    { rw: "01", name: "Deden Sunandar", area: "Dusun Krajan" },
    { rw: "02", name: "Edi Mulyadi", area: "Dusun Kalijaya" },
    { rw: "03", name: "Ade Sobarna", area: "Dusun Gempol Tengah" },
    { rw: "04", name: "Suryaman", area: "Dusun Gempol Utara" },
    { rw: "05", name: "Oman Rohman", area: "Dusun Gempol Selatan" },
    { rw: "06", name: "Tatang Sutisna", area: "Dusun Krajan Wetan" },
    { rw: "07", name: "Junaedi", area: "Dusun Krajan Kulon" },
    { rw: "08", name: "Cecep Supriadi", area: "Dusun Lingkar Luar" },
  ];

  return (
    <div className="w-full flex flex-col min-h-screen bg-background">
      {/* 1. Page Hero */}
      <PageHero
        title="Pemerintahan Desa"
        description={`Mengenal struktur aparatur pemerintahan desa, jajaran perangkat desa, serta ketua rukun warga & tetangga di Desa ${villageProfile.name}.`}
        breadcrumbItems={breadcrumbs}
      />

      {/* 2. Interactive Navigation Tabs */}
      <section className="py-16 bg-eggshell dark:bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="struktur" className="w-full flex flex-col items-center">
            <TabsList className="bg-cardSoft dark:bg-card border border-orinoco/40 dark:border-border/60 rounded-2xl p-1 mb-10 overflow-x-auto max-w-full flex justify-start sm:justify-center gap-1 font-sans">
              <TabsTrigger
                value="struktur"
                className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-textMuted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Users className="h-4 w-4" />
                <span>Struktur Aparatur Desa</span>
              </TabsTrigger>
              <TabsTrigger
                value="rtrw"
                className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-textMuted data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Table className="h-4 w-4" />
                <span>Direktori RW & RT</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB CONTENT: STRUKTUR ORGANISASI */}
            <TabsContent value="struktur" className="w-full outline-none">
              {/* Kades (Top) */}
              {kades && (
                <div className="mb-12">
                  <SectionHeader label="Kepala Pemerintahan" title={`Kepala Desa ${villageProfile.name}`} className="mb-6" />
                  <div className="flex justify-center">
                    <div className="w-full max-w-sm">
                      <StaffCard member={kades} />
                    </div>
                  </div>
                </div>
              )}

              {/* Sekdes (Second Level) */}
              {sekdes && (
                <div className="mb-12 border-t border-orinoco/10 dark:border-border/30 pt-10">
                  <SectionHeader label="Kesekretariatan" title="Sekretaris Desa" className="mb-6" />
                  <div className="flex justify-center">
                    <div className="w-full max-w-sm">
                      <StaffCard member={sekdes} />
                    </div>
                  </div>
                </div>
              )}

              {/* Kaurs & Kasis (Third Level) */}
              {kaurKasi.length > 0 && (
                <div className="mb-12 border-t border-orinoco/10 dark:border-border/30 pt-10">
                  <SectionHeader label="Pelaksana Teknis & Staf" title="Kepala Urusan (Kaur) & Kepala Seksi (Kasi)" className="mb-8" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 justify-center">
                    {kaurKasi.map((member) => (
                      <div key={member.id} className="w-full">
                        <StaffCard member={member} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kadus (Fourth Level) */}
              {kadus.length > 0 && (
                <div className="mb-12 border-t border-orinoco/10 dark:border-border/30 pt-10">
                  <SectionHeader label="Pelaksana Kewilayahan" title="Kepala Dusun (Kadus)" className="mb-8" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto justify-center">
                    {kadus.map((member) => (
                      <div key={member.id} className="w-full">
                        <StaffCard member={member} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Staff Lain */}
              {staffLain.length > 0 && (
                <div className="border-t border-orinoco/10 dark:border-border/30 pt-10">
                  <SectionHeader label="Lembaga Desa" title="Lembaga Kemasyarakatan & Staf Pendukung" className="mb-8" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto justify-center">
                    {staffLain.map((member) => (
                      <div key={member.id} className="w-full">
                        <StaffCard member={member} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB CONTENT: RW & RT DIRECTORY */}
            <TabsContent value="rtrw" className="w-full outline-none font-sans">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                
                {/* RW Table */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="bg-cardSoft dark:bg-card border border-orinoco/30 dark:border-border/60 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-heading text-lg font-bold text-textMain dark:text-foreground mb-1 flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      Daftar Ketua RW
                    </h3>
                    <p className="text-xs text-textMuted dark:text-muted-foreground mb-4">
                      Total 8 Rukun Warga di wilayah administrasi Desa {villageProfile.name}.
                    </p>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <UiTable>
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            <TableHead className="w-16 font-bold">RW</TableHead>
                            <TableHead className="font-bold">Nama Ketua RW</TableHead>
                            <TableHead className="font-bold">Dusun / Wilayah</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rwList.map((row) => (
                            <TableRow key={row.rw}>
                              <TableCell className="font-bold text-center">{row.rw}</TableCell>
                              <TableCell className="font-medium text-textMain dark:text-foreground">{row.name}</TableCell>
                              <TableCell className="text-xs text-textMuted dark:text-muted-foreground">{row.area}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </UiTable>
                    </div>
                  </div>
                </div>

                {/* RT Table */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="bg-cardSoft dark:bg-card border border-orinoco/30 dark:border-border/60 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-heading text-lg font-bold text-textMain dark:text-foreground mb-1 flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-primary" />
                      Daftar Ketua RT
                    </h3>
                    <p className="text-xs text-textMuted dark:text-muted-foreground mb-4">
                      Daftar perwakilan Rukun Tetangga aktif di Desa {villageProfile.name}.
                    </p>
                    <div className="rounded-xl border border-border overflow-hidden">
                      <UiTable>
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            <TableHead className="w-16 font-bold text-center">RT</TableHead>
                            <TableHead className="w-16 font-bold text-center">RW</TableHead>
                            <TableHead className="font-bold">Nama Ketua RT</TableHead>
                            <TableHead className="font-bold text-right">KK</TableHead>
                            <TableHead className="font-bold text-right">Penduduk</TableHead>
                            <TableHead className="font-bold text-center">Hubungi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rtrw.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell className="font-bold text-center">{row.rt}</TableCell>
                              <TableCell className="font-semibold text-center text-textMuted dark:text-muted-foreground">{row.rw}</TableCell>
                              <TableCell className="font-medium text-textMain dark:text-foreground">{row.headName}</TableCell>
                              <TableCell className="text-right text-xs text-textMuted dark:text-muted-foreground font-mono">{row.households}</TableCell>
                              <TableCell className="text-right text-xs text-textMuted dark:text-muted-foreground font-mono">{row.population}</TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                  asChild
                                >
                                  <a
                                    href={`https://wa.me/${row.phone || villageProfile.whatsapp}?text=Halo%20Ketua%20RT%20${row.rt}%20RW%20${row.rw}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Phone className="h-4 w-4" />
                                  </a>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </UiTable>
                    </div>
                  </div>
                </div>

              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 3. Footer Informational Banner */}
      <section className="py-12 bg-cardSoft dark:bg-card/20 border-t border-orinoco/10 dark:border-border/30 font-sans text-xs sm:text-sm text-textMuted dark:text-muted-foreground text-center">
        <div className="container mx-auto px-4 max-w-3xl flex flex-col gap-2">
          <ShieldAlert className="h-6 w-6 text-primary mx-auto mb-1 animate-pulse" />
          <p className="font-bold text-textMain dark:text-foreground">Informasi Jabatan Rukun Tetangga (RT) & Rukun Warga (RW)</p>
          <p className="leading-relaxed">
            Data pengurus RT dan RW di atas merupakan data informasi resmi kepengurusan lingkungan di Desa {villageProfile.name}. Jabatan Ketua RT dan RW bersifat sosial-kemasyarakatan guna mempererat kerukunan bertetangga dan koordinasi pembangunan tingkat tapak, bukan sebagai akun administrator dashboard pelayanan online.
          </p>
        </div>
      </section>
    </div>
  );
}
