"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, CheckCircle2, Store, UserPlus, HelpCircle } from "lucide-react";

export interface ActivityItem {
  id: string;
  type: "complaint" | "service" | "approval" | "umkm" | "user" | "other";
  message: string;
  time: string;
  user: string;
}

const defaultActivities: ActivityItem[] = [
  {
    id: "act1",
    type: "complaint",
    message: "Budi Santoso mengirim pengaduan 'Sampah Menumpuk di Saluran Irigasi'",
    time: "10 menit lalu",
    user: "Warga",
  },
  {
    id: "act2",
    type: "service",
    message: "Memproses pengajuan 'Surat Keterangan Usaha' oleh Ani Wijaya",
    time: "1 jam lalu",
    user: "Operator Layanan",
  },
  {
    id: "act3",
    type: "approval",
    message: "Menandatangani Surat Pengantar Nikah (n1-n4) untuk Rian Hidayat",
    time: "3 jam lalu",
    user: "Kepala Desa",
  },
  {
    id: "act4",
    type: "umkm",
    message: "Katalog produk baru 'Kerajinan Bambu Lestari' disetujui tampil di web",
    time: "5 jam lalu",
    user: "Admin Desa",
  },
  {
    id: "act5",
    type: "user",
    message: "Ahmad Rustandi diperbarui data jabatannya sebagai Kaur Keuangan",
    time: "Kemarin",
    user: "Sekretaris Desa",
  },
  {
    id: "act6",
    type: "complaint",
    message: "Mengubah status pengaduan c2 (Lampu PJU Mati) menjadi 'Sedang Diproses'",
    time: "Kemarin",
    user: "Operator Pengaduan",
  },
];

export function ActivityCard({ activities = defaultActivities }: { activities?: ActivityItem[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "complaint":
        return <MessageSquare className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
      case "service":
        return <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "approval":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "umkm":
        return <Store className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "user":
        return <UserPlus className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <HelpCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "complaint":
        return "bg-rose-50 dark:bg-rose-950/30";
      case "service":
        return "bg-blue-50 dark:bg-blue-950/30";
      case "approval":
        return "bg-emerald-50 dark:bg-emerald-950/30";
      case "umkm":
        return "bg-amber-50 dark:bg-amber-950/30";
      case "user":
        return "bg-purple-50 dark:bg-purple-950/30";
      default:
        return "bg-slate-50 dark:bg-slate-950/30";
    }
  };

  return (
    <Card className="border border-orinoco/30 dark:border-border/60 bg-white dark:bg-card rounded-3xl shadow-sm">
      <CardHeader className="pb-3 border-b border-orinoco/10 px-6 py-5">
        <CardTitle className="font-heading text-base font-extrabold text-textMain dark:text-foreground">
          Log Aktivitas Terkini
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative border-l border-orinoco/30 dark:border-border/50 ml-3 pl-6 space-y-6">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Dot Icon indicator */}
              <div
                className={`absolute -left-[35px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full border border-white dark:border-card shadow-sm ${getIconBg(
                  act.type
                )}`}
              >
                {getIcon(act.type)}
              </div>

              {/* Log message */}
              <div className="flex flex-col gap-1">
                <p className="text-xs md:text-sm font-sans font-medium text-textMain dark:text-foreground leading-normal">
                  {act.message}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-textMuted dark:text-muted-foreground font-semibold uppercase tracking-wider font-sans mt-0.5">
                  <span>{act.user}</span>
                  <span className="h-1 w-1 rounded-full bg-orinoco dark:bg-border/60" />
                  <span>{act.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
