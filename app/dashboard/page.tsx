"use client";

import React from "react";
import { DashboardStatCard } from "@/components/dashboard/DashboardStatCard";
import { ActivityCard } from "@/components/dashboard/ActivityCard";
import { publicServices } from "@/data/services";
import { publicComplaints } from "@/data/complaints";
import { newsArticles } from "@/data/news";
import { localUmkmList } from "@/data/umkm";
import { villageProfile } from "@/data/village";
import {
  Users,
  Home,
  ClipboardList,
  MessageSquare,
  AlertTriangle,
  Newspaper,
  Store,
  FileCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const chartData = [
  { name: "Jan", "Pengaduan Masuk": 2, Selesai: 1 },
  { name: "Feb", "Pengaduan Masuk": 4, Selesai: 3 },
  { name: "Mar", "Pengaduan Masuk": 3, Selesai: 2 },
  { name: "Apr", "Pengaduan Masuk": 7, Selesai: 5 },
  { name: "Mei", "Pengaduan Masuk": 5, Selesai: 4 },
  { name: "Jun", "Pengaduan Masuk": 8, Selesai: 5 },
];

export default function DashboardOverviewPage() {
  // Compute metrics dynamically from mock data
  const totalPop = villageProfile.statistics.population;
  const totalKK = villageProfile.statistics.households;
  const totalServices = publicServices.length;
  const totalComplaints = publicComplaints.length;
  const pendingComplaints = publicComplaints.filter(
    (c) => c.status === "Sedang Diproses" || c.status === "Belum Diproses"
  ).length;
  const completedComplaints = publicComplaints.filter((c) => c.status === "Selesai").length;
  const totalNews = newsArticles.length;
  const totalUmkm = localUmkmList.length;

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-verdun to-[#3a4217] text-white p-6 md:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
          <Users className="h-96 w-96" />
        </div>
        <div className="flex flex-col gap-2 relative z-10">
          <span className="text-xs font-bold text-orinoco uppercase tracking-wider font-sans">
            Sistem Informasi Desa Citimun
          </span>
          <h2 className="text-xl md:text-3xl font-heading font-extrabold tracking-tight">
            Selamat Datang di Portal Admin
          </h2>
          <p className="text-xs md:text-sm text-eggshell/90 font-sans max-w-xl leading-relaxed mt-1">
            Gunakan panel ini untuk mengelola data kependudukan, menerbitkan berita desa, memproses surat permohonan layanan publik, dan memantau aspirasi/pengaduan masyarakat secara berkala.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <DashboardStatCard
          title="Total Penduduk"
          value={totalPop}
          icon={Users}
          description="Jiwa terdaftar resmi"
          trend="+1.4% tahun ini"
          trendType="up"
        />
        <DashboardStatCard
          title="Jumlah KK"
          value={totalKK}
          icon={Home}
          description="Kepala Keluarga aktif"
          trend="Rata-rata 3.4 jiwa/KK"
          trendType="neutral"
        />
        <DashboardStatCard
          title="Layanan Publik"
          value={totalServices}
          icon={ClipboardList}
          description="Jenis surat administrasi"
          trend="Proses gratis 100%"
          trendType="neutral"
        />
        <DashboardStatCard
          title="Total Pengaduan"
          value={totalComplaints}
          icon={MessageSquare}
          description={`${completedComplaints} laporan diselesaikan`}
          trend={`${pendingComplaints} dalam proses tindak lanjut`}
          trendType="down"
        />
        <DashboardStatCard
          title="Pengaduan Aktif"
          value={pendingComplaints}
          icon={AlertTriangle}
          description="Membutuhkan tanggapan"
          trend="Target respon <2x24 jam"
          trendType="neutral"
        />
        <DashboardStatCard
          title="Berita Terbit"
          value={totalNews}
          icon={Newspaper}
          description="Artikel & sosialisasi"
          trend="Update kegiatan rutin"
          trendType="neutral"
        />
        <DashboardStatCard
          title="UMKM Terdaftar"
          value={totalUmkm}
          icon={Store}
          description="Pelaku usaha binaan"
          trend="Sektor makanan & kriya dominan"
          trendType="up"
        />
        <DashboardStatCard
          title="Rasio Penyelesaian"
          value={`${Math.round((completedComplaints / totalComplaints) * 100)}%`}
          icon={FileCheck}
          description="Tingkat solusi laporan"
          trend="Sangat Baik"
          trendType="up"
        />
      </div>

      {/* Chart & Activities */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* Complaints Chart */}
        <Card className="xl:col-span-2 border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
          <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
            <CardTitle className="font-heading text-base font-extrabold text-textMain dark:text-foreground">
              Tren Pengaduan Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full font-sans text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FCFFF5",
                      border: "1px solid #DBDDAF",
                      borderRadius: "12px",
                      color: "#1F2A13",
                    }}
                  />
                  <Bar dataKey="Pengaduan Masuk" fill="#999F54" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Selesai" fill="#48521C" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 text-xs font-semibold text-textMuted mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-smoke rounded-sm" />
                <span>Pengaduan Masuk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-verdun rounded-sm" />
                <span>Laporan Selesai</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <div className="xl:col-span-1">
          <ActivityCard />
        </div>
      </div>
    </div>
  );
}
