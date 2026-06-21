"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, RefreshCw, Landmark, Globe, MapPin, Eye } from "lucide-react";
import { villageProfile } from "@/data/village";
import { createClient } from "@/utils/supabase/client";

export default function DashboardProfilDesaPage() {
  const [profile, setProfile] = useState({
    name: villageProfile.name,
    slogan: villageProfile.slogan,
    address: villageProfile.address,
    whatsapp: villageProfile.whatsapp,
    email: villageProfile.email,
    district: villageProfile.district,
    regency: villageProfile.regency,
    province: villageProfile.province,
    vision: villageProfile.vision,
    mission: villageProfile.mission.join("\n"),
    history: villageProfile.history,
    area: villageProfile.statistics.areaSize,
    topography: villageProfile.geographic.topography,
    northBorder: villageProfile.geographic.borders.north,
    southBorder: villageProfile.geographic.borders.south,
    eastBorder: villageProfile.geographic.borders.east,
    westBorder: villageProfile.geographic.borders.west,
  });

  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("village_profile").select("*").maybeSingle();
        if (data && !error) {
          setProfile({
            name: data.name,
            slogan: data.slogan || "",
            address: data.address || "",
            whatsapp: data.whatsapp || "",
            email: data.email || "",
            district: "Tirtajaya",
            regency: "Karawang",
            province: "Jawa Barat",
            vision: data.vision || "",
            mission: Array.isArray(data.mission) ? data.mission.join("\n") : (data.mission || ""),
            history: data.history || "",
            area: data.area_size || "",
            topography: data.geography || "",
            northBorder: data.north_boundary || "",
            southBorder: data.south_boundary || "",
            eastBorder: data.east_boundary || "",
            westBorder: data.west_boundary || "",
          });
        }
      } catch (e) {
        console.error("Gagal memuat profil desa:", e);
      } finally {
        setMounted(true);
      }
    }
    loadProfile();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const supabase = createClient();
      const { data: current } = await supabase.from("village_profile").select("id").maybeSingle();
      
      const payload = {
        name: profile.name,
        slogan: profile.slogan,
        address: profile.address,
        whatsapp: profile.whatsapp,
        email: profile.email,
        vision: profile.vision,
        mission: profile.mission.split("\n").filter(m => m.trim() !== ""),
        history: profile.history,
        area_size: profile.area,
        geography: profile.topography,
        north_boundary: profile.northBorder,
        south_boundary: profile.southBorder,
        east_boundary: profile.eastBorder,
        west_boundary: profile.westBorder,
        updated_at: new Date().toISOString(),
      };

      if (current) {
        const { error } = await supabase.from("village_profile").update(payload).eq("id", current.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("village_profile").insert(payload);
        if (error) throw error;
      }
      
      toast.success("Profil Desa berhasil diperbarui di database!");
      const { logActivity } = await import("@/lib/activity");
      logActivity("Mengubah Profil Desa", `Mengubah informasi umum, visi, misi, atau batas teritorial Desa ${profile.name}`);
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menyimpan profil: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setProfile({
      name: villageProfile.name,
      slogan: villageProfile.slogan,
      address: villageProfile.address,
      whatsapp: villageProfile.whatsapp,
      email: villageProfile.email,
      district: villageProfile.district,
      regency: villageProfile.regency,
      province: villageProfile.province,
      vision: villageProfile.vision,
      mission: villageProfile.mission.join("\n"),
      history: villageProfile.history,
      area: villageProfile.statistics.areaSize,
      topography: villageProfile.geographic.topography,
      northBorder: villageProfile.geographic.borders.north,
      southBorder: villageProfile.geographic.borders.south,
      eastBorder: villageProfile.geographic.borders.east,
      westBorder: villageProfile.geographic.borders.west,
    });
    toast.info("Formulir direset ke data default.");
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans p-6">Memuat sistem data profil desa...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
            Kelola Profil Desa
          </h2>
          <p className="text-xs text-textMuted dark:text-muted-foreground font-sans">
            Konfigurasikan slogan, visi & misi, kontak publik, dan batas administrasi wilayah Desa {profile.name}.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: General Profile Form */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
              <CardTitle className="font-heading text-base font-extrabold text-textMain dark:text-foreground">
                Informasi Umum & Geografis
              </CardTitle>
              <CardDescription className="text-xs text-textMuted font-sans">
                Data identitas desa dan kewilayahan yang akan tampil di situs publik.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold text-textMain">Nama Desa</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="rounded-xl border-orinoco/20 focus-visible:ring-primary focus-visible:border-primary text-xs"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="slogan" className="text-xs font-semibold text-textMain">Slogan Desa</Label>
                  <Input
                    id="slogan"
                    name="slogan"
                    value={profile.slogan}
                    onChange={handleInputChange}
                    className="rounded-xl border-orinoco/20 focus-visible:ring-primary focus-visible:border-primary text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="district" className="text-xs font-semibold text-textMain">Kecamatan</Label>
                  <Input
                    id="district"
                    name="district"
                    value={profile.district}
                    onChange={handleInputChange}
                    className="rounded-xl border-orinoco/20 text-xs"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="regency" className="text-xs font-semibold text-textMain">Kabupaten</Label>
                  <Input
                    id="regency"
                    name="regency"
                    value={profile.regency}
                    onChange={handleInputChange}
                    className="rounded-xl border-orinoco/20 text-xs"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="area" className="text-xs font-semibold text-textMain">Luas Wilayah</Label>
                  <Input
                    id="area"
                    name="area"
                    value={profile.area}
                    onChange={handleInputChange}
                    className="rounded-xl border-orinoco/20 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="address" className="text-xs font-semibold text-textMain">Alamat Kantor Desa</Label>
                <Input
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                  className="rounded-xl border-orinoco/20 text-xs"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="topography" className="text-xs font-semibold text-textMain">Topografi Wilayah</Label>
                <Textarea
                  id="topography"
                  name="topography"
                  value={profile.topography}
                  onChange={handleInputChange}
                  rows={2}
                  className="rounded-xl border-orinoco/20 text-xs min-h-[50px]"
                />
              </div>

              <div className="border-t border-orinoco/10 pt-4">
                <h4 className="text-xs font-bold text-textMain uppercase tracking-wider mb-3">Batas Administrasi Wilayah</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="northBorder" className="text-[10px] uppercase font-bold text-textMuted">Utara</Label>
                    <Input
                      id="northBorder"
                      name="northBorder"
                      value={profile.northBorder}
                      onChange={handleInputChange}
                      className="rounded-xl border-orinoco/20 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="southBorder" className="text-[10px] uppercase font-bold text-textMuted">Selatan</Label>
                    <Input
                      id="southBorder"
                      name="southBorder"
                      value={profile.southBorder}
                      onChange={handleInputChange}
                      className="rounded-xl border-orinoco/20 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="eastBorder" className="text-[10px] uppercase font-bold text-textMuted">Timur</Label>
                    <Input
                      id="eastBorder"
                      name="eastBorder"
                      value={profile.eastBorder}
                      onChange={handleInputChange}
                      className="rounded-xl border-orinoco/20 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="westBorder" className="text-[10px] uppercase font-bold text-textMuted">Barat</Label>
                    <Input
                      id="westBorder"
                      name="westBorder"
                      value={profile.westBorder}
                      onChange={handleInputChange}
                      className="rounded-xl border-orinoco/20 text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
              <CardTitle className="font-heading text-base font-extrabold text-textMain dark:text-foreground">
                Visi, Misi & Sejarah
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="vision" className="text-xs font-semibold text-textMain">Visi Desa</Label>
                <Textarea
                  id="vision"
                  name="vision"
                  value={profile.vision}
                  onChange={handleInputChange}
                  rows={2}
                  className="rounded-xl border-orinoco/20 text-xs min-h-[60px]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="mission" className="text-xs font-semibold text-textMain">Misi Desa (Satu kalimat per baris)</Label>
                <Textarea
                  id="mission"
                  name="mission"
                  value={profile.mission}
                  onChange={handleInputChange}
                  rows={4}
                  className="rounded-xl border-orinoco/20 text-xs min-h-[100px]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="history" className="text-xs font-semibold text-textMain">Sejarah Singkat Desa</Label>
                <Textarea
                  id="history"
                  name="history"
                  value={profile.history}
                  onChange={handleInputChange}
                  rows={5}
                  className="rounded-xl border-orinoco/20 text-xs min-h-[120px]"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Contact, Quick Stats & Action buttons */}
        <div className="flex flex-col gap-6">
          {/* Action buttons card */}
          <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
              <CardTitle className="font-heading text-base font-extrabold text-textMain dark:text-foreground">
                Tindakan Form
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full bg-verdun hover:bg-[#3a4217] text-white rounded-xl py-5 font-semibold text-xs gap-2 shadow-sm cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="w-full rounded-xl py-5 font-semibold text-xs border-orinoco/30 text-textMain hover:bg-cardSoft gap-2 cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Reset ke Default
              </Button>
            </CardContent>
          </Card>

          {/* Contact settings card */}
          <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
              <CardTitle className="font-heading text-base font-extrabold text-textMain dark:text-foreground">
                Hubungan & Media
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="whatsapp" className="text-xs font-semibold text-textMain">WhatsApp Helpdesk (Kode Negara)</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  value={profile.whatsapp}
                  onChange={handleInputChange}
                  className="rounded-xl border-orinoco/20 text-xs"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-textMain">Email Resmi Pemdes</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="rounded-xl border-orinoco/20 text-xs"
                  required
                />
              </div>

              <div className="p-4 bg-cardSoft rounded-2xl border border-orinoco/20 flex flex-col gap-3">
                <div className="flex gap-3">
                  <Landmark className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-textMain">Lokasi {profile.name}</span>
                    <span className="text-[10px] text-textMuted">Kec. {profile.district}, Kab. {profile.regency}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Globe className="h-5 w-5 text-primary shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-textMain">Jam Pelayanan Kantor</span>
                    <span className="text-[10px] text-textMuted">Senin - Jumat (08:00 - 15:00 WIB)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
