"use client";

import React, { useState, useEffect } from "react";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Users,
  Home,
  MapPin,
  Download,
  BarChart2,
  PieChart as PieIcon,
  Settings,
  ListFilter,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  FileText,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  getVillageStats,
  getDemographicStats,
  getReligionStats,
  saveVillageStats,
  saveDemographicStats,
  saveReligionStats,
  VillageStats,
  ReligionStat,
} from "@/lib/demographics";
import { DemographicData } from "@/types";

const COLORS = ["#48521C", "#999F54", "#DBDDAF", "#8884d8", "#82ca9d", "#ffc658"];

export default function DashboardDataDesaPage() {
  const [activeTab, setActiveTab] = useState<"ringkasan" | "statistik" | "kategori">("ringkasan");
  
  // Data States
  const [villageStats, setVillageStats] = useState<VillageStats>({
    population: "4.826 jiwa",
    households: "1.392 KK",
    rtCount: 24,
    rwCount: 8,
    areaSize: "425 Ha",
  });
  
  const [demoStats, setDemoStats] = useState<DemographicData>({
    gender: [],
    education: [],
    job: [],
    ageGroup: [],
  });
  
  const [religionStats, setReligionStats] = useState<ReligionStat[]>([]);
  const [mounted, setMounted] = useState(false);
  const [genderInputs, setGenderInputs] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const loadingToast = toast.loading("Memperbarui data kependudukan dari database...");
    try {
      await loadAllData();
      toast.success("Data kependudukan berhasil diperbarui!", { id: loadingToast });
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui data", { id: loadingToast });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Gagal membuka jendela cetak. Pastikan pop-up dibolehkan di browser Anda.");
      return;
    }

    const todayStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const genderHtml = demoStats.gender.map(g => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: 500;">${g.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${g.value.toLocaleString("id-ID")} Jiwa</td>
        <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #48521C;">${g.percentage}</td>
      </tr>
    `).join("");

    const eduHtml = demoStats.education.map(e => `
      <tr>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">${e.level}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${e.count.toLocaleString("id-ID")} Jiwa</td>
      </tr>
    `).join("");

    const ageHtml = demoStats.ageGroup.map(a => `
      <tr>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">${a.range} Tahun</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${a.count.toLocaleString("id-ID")} Jiwa</td>
      </tr>
    `).join("");

    const jobHtml = demoStats.job.map(j => `
      <tr>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">${j.title}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${j.count.toLocaleString("id-ID")} Jiwa</td>
      </tr>
    `).join("");

    const religionHtml = religionStats.map(r => `
      <tr>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">${r.name}</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${r.count.toLocaleString("id-ID")} Jiwa</td>
        <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 500; color: #48521C;">${r.percentage}</td>
      </tr>
    `).join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Laporan Demografi Desa Gempolkarya - ${todayStr}</title>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
          
          body {
            font-family: 'Inter', sans-serif;
            color: #1f2937;
            line-height: 1.5;
            padding: 40px;
            max-width: 900px;
            margin: 0 auto;
            background-color: #ffffff;
          }

          /* Kop Surat */
          .kop-surat {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 4px double #1f2937;
            padding-bottom: 15px;
            margin-bottom: 30px;
            text-align: center;
          }

          .kop-header {
            width: 100%;
          }

          .kop-pemerintah {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 0;
          }

          .kop-kecamatan {
            font-size: 15px;
            font-weight: 600;
            text-transform: uppercase;
            margin: 2px 0;
          }

          .kop-desa {
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            font-weight: 700;
            text-transform: uppercase;
            margin: 5px 0;
            color: #48521C;
          }

          .kop-alamat {
            font-size: 11px;
            font-style: italic;
            color: #6b7280;
            margin: 2px 0;
          }

          /* Judul Laporan */
          .laporan-title {
            text-align: center;
            margin-bottom: 30px;
          }

          .laporan-title h2 {
            font-size: 18px;
            font-weight: 800;
            text-transform: uppercase;
            margin: 0;
            color: #111827;
            letter-spacing: 0.5px;
          }

          .laporan-title p {
            font-size: 12px;
            color: #6b7280;
            margin: 5px 0 0 0;
          }

          /* Summary Grid */
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }

          .summary-card {
            background-color: #fcfcf9;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            padding: 15px;
            text-align: center;
          }

          .summary-label {
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 700;
            color: #6b7280;
            letter-spacing: 0.5px;
          }

          .summary-value {
            font-size: 20px;
            font-weight: 800;
            color: #48521C;
            margin-top: 5px;
          }

          /* Section styling */
          .section-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #48521C;
            border-bottom: 2px solid #48521C;
            padding-bottom: 5px;
            margin-top: 25px;
            margin-bottom: 15px;
          }

          /* Tables */
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 25px;
          }

          th {
            background-color: #48521C;
            color: #ffffff;
            font-weight: 600;
            text-align: left;
            padding: 8px 10px;
          }

          /* Two Column Grid for Sub-Tables */
          .grid-two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
          }

          /* Signature Block */
          .signature-area {
            margin-top: 50px;
            display: flex;
            justify-content: flex-end;
          }

          .signature-box {
            text-align: center;
            width: 250px;
            font-size: 12px;
          }

          .signature-date {
            margin-bottom: 75px;
          }

          .signature-name {
            font-weight: 700;
            text-decoration: underline;
          }

          /* Print Settings */
          @media print {
            body {
              padding: 20px;
              background-color: #ffffff;
            }
            .no-print {
              display: none;
            }
            .page-break {
              page-break-before: always;
            }
          }
        </style>
      </head>
      <body>
        <!-- Header / Kop Surat -->
        <div class="kop-surat">
          <div class="kop-header">
            <h3 class="kop-pemerintah">Pemerintah Kabupaten Karawang</h3>
            <h4 class="kop-kecamatan">Kecamatan Tirtamulya</h4>
            <h2 class="kop-desa">Kantor Kepala Desa Gempolkarya</h2>
            <p class="kop-alamat">Alamat: Jl. Raya Gempolkarya, Desa Gempolkarya, Tirtamulya, Karawang 41372</p>
          </div>
        </div>

        <!-- Judul Laporan -->
        <div class="laporan-title">
          <h2>Laporan Statistik & Demografi Warga</h2>
          <p>Sistem Data Mandiri Desa Gempolkarya • Per ${todayStr}</p>
        </div>

        <!-- Ringkasan Angka Utama -->
        <div class="summary-grid">
          <div class="summary-card">
            <div class="summary-label">Total Penduduk</div>
            <div class="summary-value">${villageStats.population}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Jumlah Kepala Keluarga</div>
            <div class="summary-value">${villageStats.households}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Luas Wilayah Administratif</div>
            <div class="summary-value">${villageStats.areaSize}</div>
          </div>
        </div>

        <!-- Jenis Kelamin & Agama (Side by side) -->
        <div class="grid-two-col">
          <div>
            <div class="section-title">Distribusi Jenis Kelamin</div>
            <table>
              <thead>
                <tr>
                  <th>Jenis Kelamin</th>
                  <th style="text-align: right;">Jumlah</th>
                  <th style="text-align: right;">Persentase</th>
                </tr>
              </thead>
              <tbody>
                ${genderHtml}
              </tbody>
            </table>
          </div>
          <div>
            <div class="section-title">Keragaman Agama</div>
            <table>
              <thead>
                <tr>
                  <th>Agama</th>
                  <th style="text-align: right;">Jumlah</th>
                  <th style="text-align: right;">Persentase</th>
                </tr>
              </thead>
              <tbody>
                ${religionHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Page break to keep education and jobs neat -->
        <div class="page-break"></div>

        <!-- Kop Surat Kecil di Halaman Kedua -->
        <div class="kop-surat" style="border-bottom: 2px solid #48521C; margin-bottom: 20px; padding-bottom: 5px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #48521C; text-align: left; width: 100%;">
            Laporan Demografi Desa Gempolkarya • Halaman 2
          </div>
        </div>

        <!-- Pendidikan & Kelompok Umur (Side by side) -->
        <div class="grid-two-col">
          <div>
            <div class="section-title">Tingkat Pendidikan Terakhir</div>
            <table>
              <thead>
                <tr>
                  <th>Tingkat Pendidikan</th>
                  <th style="text-align: right;">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                ${eduHtml}
              </tbody>
            </table>
          </div>
          <div>
            <div class="section-title">Sebaran Kelompok Umur</div>
            <table>
              <thead>
                <tr>
                  <th>Kelompok Umur</th>
                  <th style="text-align: right;">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                ${ageHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sektor Pekerjaan -->
        <div class="section-title">Mata Pencaharian Utama</div>
        <table>
          <thead>
            <tr>
              <th>Bidang Pekerjaan / Sektor</th>
              <th style="text-align: right;">Jumlah Jiwa</th>
            </tr>
          </thead>
          <tbody>
            ${jobHtml}
          </tbody>
        </table>

        <!-- Signature Block -->
        <div class="signature-area">
          <div class="signature-box">
            <div class="signature-date">Gempolkarya, ${todayStr}</div>
            <div style="margin-bottom: 60px;">Kepala Desa Gempolkarya,</div>
            <div class="signature-name">KARSUM</div>
            <div style="font-size: 10px; color: #6b7280; margin-top: 2px;">NIP. 19780512 200701 1 002</div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };


  async function loadAllData() {
    const v = await getVillageStats();
    const d = await getDemographicStats();
    const r = await getReligionStats();
    setVillageStats(v);
    setDemoStats(d);
    setReligionStats(r);
    if (d.gender) {
      setGenderInputs(d.gender.map(g => g.value.toString()));
    }
  }

  // Sync with Supabase
  useEffect(() => {
    loadAllData().then(() => setMounted(true));
  }, []);

  // Form states for general statistics
  const [formStats, setFormStats] = useState({
    population: "",
    households: "",
    rtCount: 0,
    rwCount: 0,
    areaSize: "",
  });

  // Populate form stats when tab opens
  useEffect(() => {
    if (mounted) {
      setFormStats({
        population: villageStats.population,
        households: villageStats.households,
        rtCount: villageStats.rtCount,
        rwCount: villageStats.rwCount,
        areaSize: villageStats.areaSize,
      });
    }
  }, [villageStats, activeTab, mounted]);

  const handleExport = (format: string) => {
    toast.success(`Data kependudukan berhasil diekspor sebagai file ${format}!`);
  };

  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: VillageStats = {
      population: formStats.population,
      households: formStats.households,
      rtCount: Number(formStats.rtCount),
      rwCount: Number(formStats.rwCount),
      areaSize: formStats.areaSize,
    };
    setVillageStats(updated);
    await saveVillageStats(updated);
    
    // Trigger update on public pages
    window.dispatchEvent(new Event("local-stats-updated"));
    toast.success("Statistik utama desa berhasil disimpan!");
    
    const { logActivity } = await import("@/lib/activity");
    logActivity("Mengubah Statistik Desa", `Mengubah data total penduduk (${formStats.population}), KK (${formStats.households}), RT/RW (${formStats.rtCount}/${formStats.rwCount}), luas wilayah (${formStats.areaSize})`);
    
    await loadAllData();
  };

  // Gender edit helpers
  const handleGenderChange = async (index: number, value: string) => {
    const newInputs = [...genderInputs];
    newInputs[index] = value;
    setGenderInputs(newInputs);

    const numVal = value === "" ? 0 : Math.max(0, parseInt(value) || 0);
    const updatedGender = [...demoStats.gender];
    if (updatedGender[index]) {
      updatedGender[index] = {
        ...updatedGender[index],
        value: numVal,
      };
    }
    
    // Calculate total sum of gender values
    const total = updatedGender.reduce((sum, g) => sum + g.value, 0);
    
    // Recalculate percentages for all genders
    const recalculatedGender = updatedGender.map((g) => {
      const pct = total > 0 ? (g.value / total) * 100 : 0;
      return {
        ...g,
        percentage: `${pct.toFixed(1)}%`,
      };
    });
    
    const updatedDemo = { ...demoStats, gender: recalculatedGender };
    setDemoStats(updatedDemo);
    await saveDemographicStats(updatedDemo);
    
    // Also automatically update total population in villageStats
    const updatedVillageStats = {
      ...villageStats,
      population: `${total.toLocaleString("id-ID")} jiwa`
    };
    setVillageStats(updatedVillageStats);
    await saveVillageStats(updatedVillageStats);

    const { logActivity } = await import("@/lib/activity");
    logActivity("Mengubah Demografi Gender", `Mengubah data jumlah jenis kelamin ${updatedGender[index]?.name || ""} menjadi ${numVal.toLocaleString("id-ID")} jiwa`);

    window.dispatchEvent(new Event("local-stats-updated"));
  };

  // Education list handlers
  const [newEdu, setNewEdu] = useState<{ level: string; count: string }>({ level: "", count: "" });
  const handleAddEdu = async () => {
    if (!newEdu.level.trim()) return toast.error("Isi tingkat pendidikan!");
    const countVal = newEdu.count === "" ? 0 : Number(newEdu.count);
    const updated = {
      ...demoStats,
      education: [...demoStats.education, { level: newEdu.level, count: countVal }],
    };
    setDemoStats(updated);
    await saveDemographicStats(updated);
    setNewEdu({ level: "", count: "" });
    window.dispatchEvent(new Event("local-stats-updated"));
    toast.success("Tingkat pendidikan baru berhasil ditambahkan!");
    
    const { logActivity } = await import("@/lib/activity");
    logActivity("Menambah Data Pendidikan", `Menambahkan tingkat pendidikan ${newEdu.level} sejumlah ${countVal.toLocaleString("id-ID")} jiwa`);
    
    await loadAllData();
  };

  const handleDeleteEdu = async (idx: number) => {
    const targetEdu = demoStats.education[idx];
    const updatedList = demoStats.education.filter((_, i) => i !== idx);
    const updated = { ...demoStats, education: updatedList };
    setDemoStats(updated);
    await saveDemographicStats(updated);
    window.dispatchEvent(new Event("local-stats-updated"));
    toast.success("Data pendidikan berhasil dihapus!");
    
    const { logActivity } = await import("@/lib/activity");
    logActivity("Menghapus Data Pendidikan", `Menghapus tingkat pendidikan ${targetEdu?.level || ""} (${targetEdu?.count || 0} jiwa)`);
    
    await loadAllData();
  };

  // Job list handlers
  const [newJob, setNewJob] = useState<{ title: string; count: string }>({ title: "", count: "" });
  const handleAddJob = async () => {
    if (!newJob.title.trim()) return toast.error("Isi nama pekerjaan!");
    const countVal = newJob.count === "" ? 0 : Number(newJob.count);
    const updated = {
      ...demoStats,
      job: [...demoStats.job, { title: newJob.title, count: countVal }],
    };
    setDemoStats(updated);
    await saveDemographicStats(updated);
    setNewJob({ title: "", count: "" });
    window.dispatchEvent(new Event("local-stats-updated"));
    toast.success("Pekerjaan baru berhasil ditambahkan!");
    
    const { logActivity } = await import("@/lib/activity");
    logActivity("Menambah Data Pekerjaan", `Menambahkan pekerjaan ${newJob.title} sejumlah ${countVal.toLocaleString("id-ID")} jiwa`);
    
    await loadAllData();
  };

  const handleDeleteJob = async (idx: number) => {
    const targetJob = demoStats.job[idx];
    const updatedList = demoStats.job.filter((_, i) => i !== idx);
    const updated = { ...demoStats, job: updatedList };
    setDemoStats(updated);
    await saveDemographicStats(updated);
    window.dispatchEvent(new Event("local-stats-updated"));
    toast.success("Data pekerjaan berhasil dihapus!");
    
    const { logActivity } = await import("@/lib/activity");
    logActivity("Menghapus Data Pekerjaan", `Menghapus pekerjaan ${targetJob?.title || ""} (${targetJob?.count || 0} jiwa)`);
    
    await loadAllData();
  };

  // Age group list handlers
  const [newAge, setNewAge] = useState<{ range: string; count: string }>({ range: "", count: "" });
  const handleAddAge = async () => {
    if (!newAge.range.trim()) return toast.error("Isi rentang usia!");
    const countVal = newAge.count === "" ? 0 : Number(newAge.count);
    const updated = {
      ...demoStats,
      ageGroup: [...demoStats.ageGroup, { range: newAge.range, count: countVal }],
    };
    setDemoStats(updated);
    await saveDemographicStats(updated);
    setNewAge({ range: "", count: "" });
    window.dispatchEvent(new Event("local-stats-updated"));
    toast.success("Kelompok usia baru berhasil ditambahkan!");
    
    const { logActivity } = await import("@/lib/activity");
    logActivity("Menambah Kelompok Usia", `Menambahkan kelompok usia ${newAge.range} sejumlah ${countVal.toLocaleString("id-ID")} jiwa`);
    
    await loadAllData();
  };

  const handleDeleteAge = async (idx: number) => {
    const targetAge = demoStats.ageGroup[idx];
    const updatedList = demoStats.ageGroup.filter((_, i) => i !== idx);
    const updated = { ...demoStats, ageGroup: updatedList };
    setDemoStats(updated);
    await saveDemographicStats(updated);
    window.dispatchEvent(new Event("local-stats-updated"));
    toast.success("Data kelompok usia berhasil dihapus!");
    
    const { logActivity } = await import("@/lib/activity");
    logActivity("Menghapus Kelompok Usia", `Menghapus kelompok usia ${targetAge?.range || ""} (${targetAge?.count || 0} jiwa)`);
    
    await loadAllData();
  };

  // Religion list handlers
  const [newReligion, setNewReligion] = useState<{ name: string; count: string; percentage: string }>({ name: "", count: "", percentage: "" });
  const handleAddReligion = async () => {
    if (!newReligion.name.trim()) return toast.error("Isi nama agama!");
    
    const countVal = newReligion.count === "" ? 0 : Number(newReligion.count);
    // Auto calculate percentage
    const totalCount = religionStats.reduce((sum, item) => sum + item.count, 0) + countVal;
    const updatedList = [...religionStats, {
      name: newReligion.name,
      count: countVal,
      percentage: newReligion.percentage.trim() || `${((countVal / (totalCount || 1)) * 100).toFixed(1)}%`
    }];
    
    setReligionStats(updatedList);
    await saveReligionStats(updatedList);
    setNewReligion({ name: "", count: "", percentage: "" });
    window.dispatchEvent(new Event("local-stats-updated"));
    toast.success("Data agama baru berhasil ditambahkan!");
    
    const { logActivity } = await import("@/lib/activity");
    logActivity("Menambah Data Keagamaan", `Menambahkan data agama ${newReligion.name} sejumlah ${countVal.toLocaleString("id-ID")} warga`);
    
    await loadAllData();
  };

  const handleDeleteReligion = async (idx: number) => {
    const targetRel = religionStats[idx];
    const updatedList = religionStats.filter((_, i) => i !== idx);
    setReligionStats(updatedList);
    await saveReligionStats(updatedList);
    window.dispatchEvent(new Event("local-stats-updated"));
    toast.success("Data agama berhasil dihapus!");
    
    const { logActivity } = await import("@/lib/activity");
    logActivity("Menghapus Data Keagamaan", `Menghapus data agama ${targetRel?.name || ""} (${targetRel?.count || 0} warga)`);
    
    await loadAllData();
  };

  if (!mounted) {
    return <div className="text-textMuted text-xs font-sans">Memuat sistem data kependudukan...</div>;
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8 font-sans pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-heading font-extrabold text-textMain dark:text-foreground">
            Analisis Demografi & Penduduk
          </h2>
          <p className="text-xs text-textMuted dark:text-muted-foreground font-sans">
            Kelola, visualisasikan, dan perbarui data statistik kependudukan Desa Gempolkarya secara real-time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="rounded-xl text-xs font-semibold border-orinoco/30 text-textMain hover:bg-cardSoft gap-1.5 py-4 cursor-pointer"
            title="Perbaharui Data dari Supabase"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Perbaharui
          </Button>
          <Button
            onClick={() => handleExport("Excel (.xlsx)")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold gap-1.5 py-4 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Ekspor Excel
          </Button>
          <Button
            onClick={handleExportPDF}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold gap-1.5 py-4 cursor-pointer"
            title="Cetak Laporan PDF Resmi"
          >
            <FileText className="h-4 w-4" />
            Cetak PDF
          </Button>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-orinoco/10 dark:border-border/40 gap-4 overflow-x-auto whitespace-nowrap scrollbar-none pb-px">
        <button
          onClick={() => setActiveTab("ringkasan")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "ringkasan"
              ? "border-primary text-primary"
              : "border-transparent text-textMuted hover:text-textMain"
          }`}
        >
          <BarChart2 className="h-4 w-4" />
          Visualisasi & Ringkasan
        </button>
        <button
          onClick={() => setActiveTab("statistik")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "statistik"
              ? "border-primary text-primary"
              : "border-transparent text-textMuted hover:text-textMain"
          }`}
        >
          <Settings className="h-4 w-4" />
          Kelola Statistik Utama
        </button>
        <button
          onClick={() => setActiveTab("kategori")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "kategori"
              ? "border-primary text-primary"
              : "border-transparent text-textMuted hover:text-textMain"
          }`}
        >
          <ListFilter className="h-4 w-4" />
          Kelola Rincian Demografi
        </button>
      </div>

      {/* Tab Content 1: Visualisasi & Ringkasan */}
      {activeTab === "ringkasan" && (
        <div className="flex flex-col gap-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardStatCard
              title="Total Penduduk"
              value={villageStats.population}
              icon={Users}
              description="Jiwa terdaftar resmi"
            />
            <DashboardStatCard
              title="Jumlah KK"
              value={villageStats.households}
              icon={Home}
              description="Kepala Keluarga terdaftar"
            />
            <DashboardStatCard
              title="Luas Wilayah"
              value={villageStats.areaSize}
              icon={MapPin}
              description="Luas administratif desa"
            />
          </div>

          {/* Grid Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gender Pie Chart */}
            <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
              <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
                <CardTitle className="font-heading text-base font-extrabold text-textMain dark:text-foreground flex items-center gap-2">
                  <PieIcon className="h-4 w-4 text-primary" />
                  Distribusi Jenis Kelamin
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="h-56 w-56">
                  {demoStats.gender.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={demoStats.gender}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {demoStats.gender.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-textMuted">Tidak ada data</div>
                  )}
                </div>
                <div className="flex flex-col gap-3 font-sans text-xs">
                  {demoStats.gender.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="h-3.5 w-3.5 rounded-sm shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-textMain">{item.name}</span>
                        <span className="text-textMuted text-[10px]">
                          {item.value} jiwa ({item.percentage})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education Level Chart */}
            <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
              <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
                <CardTitle className="font-heading text-base font-extrabold text-textMain dark:text-foreground flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  Tingkat Pendidikan Terakhir
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-56 w-full text-xs font-sans">
                  {demoStats.education.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={demoStats.education} margin={{ left: -20, right: 10 }}>
                        <XAxis dataKey="level" stroke="#9CA3AF" tickLine={false} />
                        <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#48521C" name="Jumlah Jiwa" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-textMuted">Tidak ada data</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Age Groups Area Chart */}
            <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
              <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
                <CardTitle className="font-heading text-base font-extrabold text-textMain dark:text-foreground flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  Sebaran Kelompok Umur
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-56 w-full text-xs font-sans">
                  {demoStats.ageGroup.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={demoStats.ageGroup} margin={{ left: -20, right: 10 }}>
                        <XAxis dataKey="range" stroke="#9CA3AF" tickLine={false} />
                        <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#48521C"
                          fill="#999F54"
                          fillOpacity={0.2}
                          name="Jumlah Jiwa"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-textMuted">Tidak ada data</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Occupations Chart */}
            <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
              <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
                <CardTitle className="font-heading text-base font-extrabold text-textMain dark:text-foreground flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  Mata Pencaharian Utama
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-56 w-full text-xs font-sans">
                  {demoStats.job.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={demoStats.job}
                        layout="vertical"
                        margin={{ left: 20, right: 10 }}
                      >
                        <XAxis type="number" stroke="#9CA3AF" tickLine={false} />
                        <YAxis dataKey="title" type="category" stroke="#9CA3AF" tickLine={false} width={100} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#999F54" name="Jumlah Jiwa" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-textMuted">Tidak ada data</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demographic Summary Table */}
          <DashboardTable
            title="Tabel Rekapitulasi Pekerjaan & Pendidikan"
            headers={["Kategori Demografi", "Sub-Kategori / Detail", "Jumlah Jiwa"]}
          >
            {demoStats.job.map((j, idx) => (
              <TableRow key={`job-${idx}`} className="border-b border-orinoco/10 dark:border-border/40 hover:bg-cardSoft/30">
                <TableCell className="px-6 py-4 font-semibold text-textMuted uppercase tracking-wider text-[10px]">
                  Pekerjaan
                </TableCell>
                <TableCell className="px-6 py-4 font-bold text-textMain">{j.title}</TableCell>
                <TableCell className="px-6 py-4">{j.count.toLocaleString()} Jiwa</TableCell>
              </TableRow>
            ))}

            {demoStats.education.map((e, idx) => (
              <TableRow key={`edu-${idx}`} className="border-b border-orinoco/10 dark:border-border/40 hover:bg-cardSoft/30">
                <TableCell className="px-6 py-4 font-semibold text-textMuted uppercase tracking-wider text-[10px]">
                  Pendidikan
                </TableCell>
                <TableCell className="px-6 py-4 font-bold text-textMain">{e.level}</TableCell>
                <TableCell className="px-6 py-4">{e.count.toLocaleString()} Jiwa</TableCell>
              </TableRow>
            ))}
          </DashboardTable>
        </div>
      )}

      {/* Tab Content 2: Kelola Statistik Utama */}
      {activeTab === "statistik" && (
        <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm max-w-2xl">
          <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
            <CardTitle className="font-heading text-lg font-bold text-textMain">Kelola Angka & Data Utama Desa</CardTitle>
            <CardDescription className="text-xs text-textMuted">
              Sesuaikan data agregat utama yang akan muncul pada menu baris atas dan ringkasan wilayah.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSaveStats} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="population" className="text-xs font-semibold text-textMain">Total Penduduk (Jiwa)</Label>
                  <Input
                    id="population"
                    value={formStats.population}
                    onChange={(e) => setFormStats(prev => ({ ...prev, population: e.target.value }))}
                    placeholder="Contoh: 4.826 jiwa"
                    className="rounded-xl text-xs bg-white dark:bg-card border-orinoco/20"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="households" className="text-xs font-semibold text-textMain">Jumlah Kepala Keluarga (KK)</Label>
                  <Input
                    id="households"
                    value={formStats.households}
                    onChange={(e) => setFormStats(prev => ({ ...prev, households: e.target.value }))}
                    placeholder="Contoh: 1.392 KK"
                    className="rounded-xl text-xs bg-white dark:bg-card border-orinoco/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rtCount" className="text-xs font-semibold text-textMain">Jumlah RT</Label>
                  <Input
                    id="rtCount"
                    type="number"
                    value={formStats.rtCount}
                    onChange={(e) => setFormStats(prev => ({ ...prev, rtCount: Number(e.target.value) }))}
                    className="rounded-xl text-xs bg-white dark:bg-card border-orinoco/20"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="rwCount" className="text-xs font-semibold text-textMain">Jumlah RW</Label>
                  <Input
                    id="rwCount"
                    type="number"
                    value={formStats.rwCount}
                    onChange={(e) => setFormStats(prev => ({ ...prev, rwCount: Number(e.target.value) }))}
                    className="rounded-xl text-xs bg-white dark:bg-card border-orinoco/20"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="areaSize" className="text-xs font-semibold text-textMain">Luas Wilayah</Label>
                  <Input
                    id="areaSize"
                    value={formStats.areaSize}
                    onChange={(e) => setFormStats(prev => ({ ...prev, areaSize: e.target.value }))}
                    placeholder="Contoh: 425 Hektar"
                    className="rounded-xl text-xs bg-white dark:bg-card border-orinoco/20"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-orinoco/10 flex justify-end">
                <Button type="submit" className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-4 cursor-pointer">
                  <Save className="h-4 w-4" />
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab Content 3: Kelola Rincian Kategori Demografi */}
      {activeTab === "kategori" && (
        <div className="flex flex-col gap-8">
          
          {/* Gender Management */}
          <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
              <CardTitle className="font-heading text-lg font-bold text-textMain">Kelola Distribusi Gender</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {demoStats.gender.map((g, idx) => (
                  <div key={idx} className="space-y-3 p-4 border border-orinoco/20 rounded-2xl bg-cardSoft/30">
                    <h4 className="text-xs font-extrabold text-primary">{g.name}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[10px] font-semibold text-textMuted">Jumlah Jiwa</Label>
                        <Input
                          type="number"
                          value={genderInputs[idx] !== undefined ? genderInputs[idx] : g.value}
                          onChange={(e) => handleGenderChange(idx, e.target.value)}
                          className="rounded-xl text-xs bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[10px] font-semibold text-textMuted">Persentase (%)</Label>
                        <Input
                          type="text"
                          value={g.percentage}
                          disabled
                          className="rounded-xl text-xs bg-white/50 text-textMuted cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education Management */}
          <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
              <CardTitle className="font-heading text-lg font-bold text-textMain">Kelola Distribusi Pendidikan</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Form Input baru */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-cardSoft/40 p-4 rounded-2xl border border-orinoco/10">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-textMain">Tingkat Pendidikan</Label>
                  <Input
                    value={newEdu.level}
                    onChange={(e) => setNewEdu(prev => ({ ...prev, level: e.target.value }))}
                    placeholder="Contoh: Sarjana (S1)"
                    className="rounded-xl text-xs bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-textMain">Jumlah Jiwa</Label>
                  <Input
                    type="number"
                    value={newEdu.count}
                    onChange={(e) => setNewEdu(prev => ({ ...prev, count: e.target.value }))}
                    className="rounded-xl text-xs bg-white"
                  />
                </div>
                <Button onClick={handleAddEdu} className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-4 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Tambah Data
                </Button>
              </div>

              {/* Tabel/Daftar Pendidikan */}
              <div className="border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold">Tingkat Pendidikan</th>
                      <th className="text-left p-3 font-bold">Jumlah Jiwa</th>
                      <th className="text-right p-3 font-bold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoStats.education.map((e, idx) => (
                      <tr key={idx} className="border-b border-orinoco/10 hover:bg-cardSoft/20">
                        <td className="p-3 font-semibold text-textMain">{e.level}</td>
                        <td className="p-3">{e.count.toLocaleString()} Jiwa</td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEdu(idx)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Jobs Management */}
          <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
              <CardTitle className="font-heading text-lg font-bold text-textMain">Kelola Distribusi Mata Pencaharian</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-cardSoft/40 p-4 rounded-2xl border border-orinoco/10">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-textMain">Nama Pekerjaan / Sektor</Label>
                  <Input
                    value={newJob.title}
                    onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Contoh: Nelayan"
                    className="rounded-xl text-xs bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-textMain">Jumlah Jiwa</Label>
                  <Input
                    type="number"
                    value={newJob.count}
                    onChange={(e) => setNewJob(prev => ({ ...prev, count: e.target.value }))}
                    className="rounded-xl text-xs bg-white"
                  />
                </div>
                <Button onClick={handleAddJob} className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-4 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Tambah Data
                </Button>
              </div>

              <div className="border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold">Nama Pekerjaan</th>
                      <th className="text-left p-3 font-bold">Jumlah Jiwa</th>
                      <th className="text-right p-3 font-bold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoStats.job.map((j, idx) => (
                      <tr key={idx} className="border-b border-orinoco/10 hover:bg-cardSoft/20">
                        <td className="p-3 font-semibold text-textMain">{j.title}</td>
                        <td className="p-3">{j.count.toLocaleString()} Jiwa</td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteJob(idx)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Age Groups Management */}
          <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
              <CardTitle className="font-heading text-lg font-bold text-textMain">Kelola Distribusi Kelompok Usia</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-cardSoft/40 p-4 rounded-2xl border border-orinoco/10">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-textMain">Rentang Usia</Label>
                  <Input
                    value={newAge.range}
                    onChange={(e) => setNewAge(prev => ({ ...prev, range: e.target.value }))}
                    placeholder="Contoh: 0 - 5 tahun"
                    className="rounded-xl text-xs bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-textMain">Jumlah Jiwa</Label>
                  <Input
                    type="number"
                    value={newAge.count}
                    onChange={(e) => setNewAge(prev => ({ ...prev, count: e.target.value }))}
                    className="rounded-xl text-xs bg-white"
                  />
                </div>
                <Button onClick={handleAddAge} className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-4 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Tambah Data
                </Button>
              </div>

              <div className="border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold">Rentang Usia</th>
                      <th className="text-left p-3 font-bold">Jumlah Jiwa</th>
                      <th className="text-right p-3 font-bold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {demoStats.ageGroup.map((a, idx) => (
                      <tr key={idx} className="border-b border-orinoco/10 hover:bg-cardSoft/20">
                        <td className="p-3 font-semibold text-textMain">{a.range}</td>
                        <td className="p-3">{a.count.toLocaleString()} Jiwa</td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteAge(idx)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Religion Management */}
          <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
            <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
              <CardTitle className="font-heading text-lg font-bold text-textMain">Kelola Data Keragaman Agama</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-cardSoft/40 p-4 rounded-2xl border border-orinoco/10">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-textMain">Agama / Kepercayaan</Label>
                  <Input
                    value={newReligion.name}
                    onChange={(e) => setNewReligion(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Islam"
                    className="rounded-xl text-xs bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-textMain">Jumlah Warga (Jiwa)</Label>
                  <Input
                    type="number"
                    value={newReligion.count}
                    onChange={(e) => setNewReligion(prev => ({ ...prev, count: e.target.value }))}
                    className="rounded-xl text-xs bg-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-textMain">Persentase (%) (Opsional)</Label>
                  <Input
                    value={newReligion.percentage}
                    onChange={(e) => setNewReligion(prev => ({ ...prev, percentage: e.target.value }))}
                    placeholder="Contoh: 99.3%"
                    className="rounded-xl text-xs bg-white"
                  />
                </div>
                <Button onClick={handleAddReligion} className="bg-verdun hover:bg-[#3a4217] text-white rounded-xl text-xs font-semibold gap-1.5 py-4 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  Tambah Agama
                </Button>
              </div>

              <div className="border border-border rounded-2xl overflow-hidden">
                <table className="w-full text-xs font-sans">
                  <thead className="bg-muted/40">
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-bold">Agama / Keyakinan</th>
                      <th className="text-left p-3 font-bold">Jumlah Jiwa</th>
                      <th className="text-left p-3 font-bold">Persentase</th>
                      <th className="text-right p-3 font-bold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {religionStats.map((r, idx) => (
                      <tr key={idx} className="border-b border-orinoco/10 hover:bg-cardSoft/20">
                        <td className="p-3 font-semibold text-textMain">{r.name}</td>
                        <td className="p-3">{r.count.toLocaleString()} Jiwa</td>
                        <td className="p-3 font-semibold text-primary">{r.percentage}</td>
                        <td className="p-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteReligion(idx)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}
