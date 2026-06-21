"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDemographicStats } from "@/lib/demographics";
import { DemographicData } from "@/types";
import { demographicStats as defaultStats } from "@/data/village";

// Theme Colors
const COLORS = ["#48521C", "#999F54", "#DBDDAF", "#5F6847", "#1F2A13"];
const SECONDARY_COLORS = ["#999F54", "#48521C"];

export function StatCharts() {
  const [stats, setStats] = React.useState<DemographicData>(defaultStats);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    async function loadStats() {
      const data = await getDemographicStats();
      setStats(data);
      setMounted(true);
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

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px] items-center justify-center text-textMuted text-sm">
        Memuat visualisasi grafik statistik...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Gender Demographics */}
      <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm">
        <CardHeader className="p-6">
          <CardTitle className="font-heading text-lg font-bold text-textMain dark:text-foreground">
            Rasio Jenis Kelamin
          </CardTitle>
          <CardDescription className="text-xs text-textMuted dark:text-muted-foreground font-sans">
            Perbandingan jumlah penduduk laki-laki dan perempuan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 24, right: 32, bottom: 12, left: 32 }}>
              <Pie
                data={stats.gender}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }: any) =>
                  `${name || ""} ${percent ? (percent * 100).toFixed(0) : "0"}%`
                }
              >
                {stats.gender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SECONDARY_COLORS[index % SECONDARY_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FCFFF5",
                  border: "1px solid #DBDDAF",
                  borderRadius: "8px",
                  color: "#1F2A13",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Age Groups */}
      <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm">
        <CardHeader className="p-6">
          <CardTitle className="font-heading text-lg font-bold text-textMain dark:text-foreground">
            Kelompok Usia
          </CardTitle>
          <CardDescription className="text-xs text-textMuted dark:text-muted-foreground font-sans">
            Distribusi penduduk berdasarkan rentang usia produktif & non-produktif
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.ageGroup} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#48521C" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#48521C" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="range" tick={{ fontSize: 10 }} stroke="#5F6847" />
              <YAxis tick={{ fontSize: 10 }} stroke="#5F6847" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FCFFF5",
                  border: "1px solid #DBDDAF",
                  borderRadius: "8px",
                  color: "#1F2A13",
                }}
              />
              <Area type="monotone" dataKey="count" name="Jumlah" stroke="#48521C" strokeWidth={2} fillOpacity={1} fill="url(#colorAge)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Education Levels */}
      <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm">
        <CardHeader className="p-6">
          <CardTitle className="font-heading text-lg font-bold text-textMain dark:text-foreground">
            Tingkat Pendidikan
          </CardTitle>
          <CardDescription className="text-xs text-textMuted dark:text-muted-foreground font-sans">
            Jumlah penduduk berdasarkan tingkat pendidikan terakhir yang diselesaikan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.education} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="level" tick={{ fontSize: 9 }} stroke="#5F6847" />
              <YAxis tick={{ fontSize: 10 }} stroke="#5F6847" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FCFFF5",
                  border: "1px solid #DBDDAF",
                  borderRadius: "8px",
                  color: "#1F2A13",
                }}
              />
              <Bar dataKey="count" name="Jumlah" fill="#999F54" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 4. Occupations */}
      <Card className="border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm">
        <CardHeader className="p-6">
          <CardTitle className="font-heading text-lg font-bold text-textMain dark:text-foreground">
            Mata Pencaharian
          </CardTitle>
          <CardDescription className="text-xs text-textMuted dark:text-muted-foreground font-sans">
            Distribusi mata pencaharian utama warga Desa Gempolkarya
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={stats.job}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="#5F6847" />
              <YAxis dataKey="title" type="category" tick={{ fontSize: 9 }} width={100} stroke="#5F6847" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FCFFF5",
                  border: "1px solid #DBDDAF",
                  borderRadius: "8px",
                  color: "#1F2A13",
                }}
              />
              <Bar dataKey="count" name="Jumlah" fill="#48521C" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

