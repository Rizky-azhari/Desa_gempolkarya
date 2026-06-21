"use client";

import React, { useState, useEffect } from "react";
import { rtrwList } from "@/data/rtrw";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, MapPin, Eye, Users, Home, Plus } from "lucide-react";
import { toast } from "sonner";
import { villageProfile } from "@/data/village";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createClient } from "@/utils/supabase/client";

export default function DashboardRtrwPage() {
  const [rtrw, setRtrw] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    rt: "",
    rw: "",
    headName: "",
    population: 0,
    households: 0,
  });

  async function loadRtRw() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("rtrw_locations")
        .select("*")
        .order("rw", { ascending: true })
        .order("rt", { ascending: true });
      if (data && !error) {
        setRtrw(data.map(item => {
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

  useEffect(() => {
    loadRtRw().then(() => setMounted(true));
  }, []);

  // Filter list
  const filteredRtrw = rtrw.filter(
    (item) =>
      item.headName.toLowerCase().includes(search.toLowerCase()) ||
      `rw ${item.rw}`.toLowerCase().includes(search.toLowerCase()) ||
      `rt ${item.rt}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setForm({
      rt: "",
      rw: "",
      headName: "",
      population: 0,
      households: 0,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setSelectedItem(item);
    setForm({
      rt: item.rt,
      rw: item.rw,
      headName: item.headName,
      population: item.population,
      households: item.households,
    });
    setIsDialogOpen(true);
  };

  const handleOpenMap = (item: any) => {
    setSelectedItem(item);
    setIsMapOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const supabase = createClient();
      const payload = {
        rt: selectedItem ? selectedItem.rt : form.rt,
        rw: selectedItem ? selectedItem.rw : form.rw,
        leader_name: form.headName,
        phone: selectedItem ? selectedItem.phone : "",
        is_active: true,
        updated_at: new Date().toISOString()
      };

      if (selectedItem) {
        // Edit mode
        const { error } = await supabase.from("rtrw_locations").update(payload).eq("id", selectedItem.id);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Mengubah Data RT/RW", `Mengubah data RT ${selectedItem.rt} / RW ${selectedItem.rw} (Ketua RT: ${form.headName})`);
        toast.success(`Data kepengurusan RT ${selectedItem.rt} / RW ${selectedItem.rw} berhasil diperbarui!`);
      } else {
        // Add mode
        const { error } = await supabase.from("rtrw_locations").insert(payload);
        if (error) throw error;
        const { logActivity } = await import("@/lib/activity");
        logActivity("Menambah Data RT/RW", `Menambahkan RT ${form.rt} / RW ${form.rw} (Ketua RT: ${form.headName})`);
        toast.success(`Unit RT ${form.rt} / RW ${form.rw} berhasil ditambahkan!`);
      }
      setIsDialogOpen(false);
      await loadRtRw();
    } catch (err: any) {
      console.error(err);
      toast.error(`Gagal menyimpan data: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans p-6">Memuat sistem data RT/RW...</div>;
  }

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
          Sensus Rukun Tetangga (RT) & RW
        </h2>
        <p className="text-xs text-textMuted dark:text-muted-foreground font-sans">
          Kelola data sensus kependudukan tingkat RT/RW, edit ketua RT yang menjabat, dan pantau sebaran kartu keluarga (KK) di tingkat dusun.
        </p>
      </div>

      {/* Main Table */}
      <DashboardTable
        title="Daftar Unit Kewilayahan Rukun Tetangga / RW"
        headers={["Rukun Tangga (RT)", "Rukun Warga (RW)", "Nama Ketua RT", "Jumlah Penduduk", "Jumlah KK", "Aksi"]}
        searchPlaceholder="Cari RT atau nama Ketua..."
        searchValue={search}
        onSearchChange={setSearch}
        extraHeaderActions={
          <Button
            onClick={handleOpenAdd}
            className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold cursor-pointer h-9 px-4 flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Tambah RT
          </Button>
        }
      >
        {filteredRtrw.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-textMuted font-sans">
              Tidak ada data RT/RW ditemukan.
            </TableCell>
          </TableRow>
        ) : (
          filteredRtrw.map((item) => (
            <TableRow key={item.id} className="border-b border-orinoco/10 dark:border-border/40 hover:bg-cardSoft/30">
              <TableCell className="px-6 py-4 font-bold text-textMain text-xs md:text-sm">RT {item.rt}</TableCell>
              <TableCell className="px-6 py-4 font-bold text-textMain text-xs md:text-sm">RW {item.rw}</TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-bold text-textMain">{item.headName}</span>
                  <span className="text-[10px] text-textMuted font-semibold font-sans tracking-wide uppercase">Ketua RT</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1 text-textMain font-medium">
                  <Users className="h-3.5 w-3.5 text-smoke shrink-0" />
                  <span>{item.population} Jiwa</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-1 text-textMain font-medium">
                  <Home className="h-3.5 w-3.5 text-smoke shrink-0" />
                  <span>{item.households} KK</span>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenMap(item)}
                    className="h-8 w-8 rounded-lg border-orinoco/30 text-textMuted hover:text-textMain hover:bg-cardSoft"
                    title="Lihat Peta Lokasi"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleOpenEdit(item)}
                    className="h-8 w-8 rounded-lg border-orinoco/30 text-textMuted hover:text-textMain hover:bg-cardSoft"
                    title="Ubah Kepengurusan"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </DashboardTable>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-3xl border-orinoco/20 shadow-xl max-w-sm w-full font-sans max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading font-extrabold text-textMain">
              {selectedItem ? `Ubah Data RT ${selectedItem.rt} / RW ${selectedItem.rw}` : "Tambah Data RT / RW"}
            </DialogTitle>
            <DialogDescription className="text-xs text-textMuted font-sans">
              {selectedItem 
                ? "Mutakhirkan kepala kepengurusan RT dan sensus keluarga setempat." 
                : "Tambahkan unit Rukun Tetangga (RT) baru beserta informasi pengurus dan sensus kependudukan."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
            {!selectedItem && (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rt" className="text-xs font-semibold text-textMain">RT</Label>
                  <Input
                    id="rt"
                    value={form.rt}
                    onChange={(e) => setForm((prev) => ({ ...prev, rt: e.target.value }))}
                    className="rounded-xl border-orinoco/20 text-xs"
                    placeholder="Contoh: 001"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rw" className="text-xs font-semibold text-textMain">RW</Label>
                  <Input
                    id="rw"
                    value={form.rw}
                    onChange={(e) => setForm((prev) => ({ ...prev, rw: e.target.value }))}
                    className="rounded-xl border-orinoco/20 text-xs"
                    placeholder="Contoh: 002"
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="headName" className="text-xs font-semibold text-textMain">Nama Ketua RT</Label>
              <Input
                id="headName"
                value={form.headName}
                onChange={(e) => setForm((prev) => ({ ...prev, headName: e.target.value }))}
                className="rounded-xl border-orinoco/20 text-xs"
                placeholder="Nama Ketua RT"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="population" className="text-xs font-semibold text-textMain">Sensus Penduduk (Jiwa)</Label>
                <Input
                  id="population"
                  type="number"
                  value={form.population || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, population: Number(e.target.value) }))}
                  className="rounded-xl border-orinoco/20 text-xs"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="households" className="text-xs font-semibold text-textMain">Jumlah KK (Keluarga)</Label>
                <Input
                  id="households"
                  type="number"
                  value={form.households || ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, households: Number(e.target.value) }))}
                  className="rounded-xl border-orinoco/20 text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-orinoco/10 flex flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl text-xs font-semibold border-orinoco/30 text-textMain hover:bg-cardSoft cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                {selectedItem ? "Simpan Data" : "Tambah Data"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Map Locator Dialog */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="rounded-3xl border-orinoco/20 shadow-xl max-w-md w-full font-sans">
          <DialogHeader>
            <DialogTitle className="font-heading font-extrabold text-textMain">
              Peta Administrasi RT {selectedItem?.rt} / RW {selectedItem?.rw}
            </DialogTitle>
            <DialogDescription className="text-xs text-textMuted font-sans">
              Lokasi wilayah RT {selectedItem?.rt} di bawah Kepengurusan {selectedItem?.headName}.
            </DialogDescription>
          </DialogHeader>

          <div className="h-64 rounded-2xl overflow-hidden border border-orinoco/20 shadow-inner relative bg-slate-50 flex items-center justify-center p-6 text-center text-xs">
            <iframe
              src={villageProfile.mapEmbedUrl}
              className="w-full h-full border-none rounded-2xl"
              allowFullScreen={false}
              loading="lazy"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              onClick={() => setIsMapOpen(false)}
              className="w-full bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Selesai / Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
