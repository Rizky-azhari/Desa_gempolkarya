"use client";

import { Check, Clock, Coins, Send, Info } from "lucide-react";
import { ServiceItem } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { villageProfile } from "@/data/village";
import { toast } from "sonner";

interface ServiceCardProps {
  service: ServiceItem;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const getCategoryStatus = (cat: typeof service.category) => {
    switch (cat) {
      case "Administrasi":
        return "info";
      case "Kependudukan":
        return "success";
      case "Kesejahteraan":
        return "warning";
      default:
        return "neutral";
    }
  };

  const handleApply = () => {
    const waText = encodeURIComponent(
      `Halo Pelayanan Desa ${villageProfile.name}, saya ingin menanyakan persyaratan atau pengajuan untuk layanan: *${service.title}*`
    );
    window.open(`https://wa.me/${villageProfile.whatsapp}?text=${waText}`, "_blank");
    toast.success("Membuka WhatsApp Layanan Desa...");
  };

  return (
    <Card className="overflow-hidden border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full font-sans">
      <CardHeader className="p-6 pb-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <StatusBadge status={getCategoryStatus(service.category)}>
            {service.category}
          </StatusBadge>
        </div>
        <CardTitle className="font-heading text-xl font-bold text-textMain dark:text-foreground leading-snug">
          {service.title}
        </CardTitle>
        <CardDescription className="text-xs text-textMuted dark:text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
          {service.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 pt-0 flex-1 flex flex-col justify-between">
        {/* Short requirement summary */}
        <div className="mt-1">
          <h4 className="text-[11px] uppercase font-bold tracking-wider text-textMain dark:text-foreground mb-2">
            Ringkasan Persyaratan:
          </h4>
          <ul className="flex flex-col gap-1.5">
            {service.requirements.slice(0, 3).map((req, index) => (
              <li key={index} className="flex gap-2 items-start text-xs text-textMuted dark:text-muted-foreground leading-tight">
                <Check className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                <span className="truncate">{req}</span>
              </li>
            ))}
            {service.requirements.length > 3 && (
              <li className="text-[10px] text-primary font-bold pl-5 mt-0.5 cursor-default">
                + {service.requirements.length - 3} Dokumen Lainnya
              </li>
            )}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-4 border-t border-orinoco/10 dark:border-border/30 flex flex-col gap-3 bg-muted/20">
        {/* Info Grid */}
        <div className="flex justify-between w-full text-xs text-textMuted dark:text-muted-foreground font-sans">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-smoke shrink-0" />
            Waktu: <strong className="text-textMain dark:text-foreground font-semibold ml-0.5">{service.duration}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Coins className="h-3.5 w-3.5 text-smoke shrink-0" />
            Biaya: <strong className="text-emerald-600 dark:text-emerald-400 font-bold ml-0.5">{service.cost}</strong>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 w-full mt-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-[11px] font-bold border-orinoco/50 hover:bg-muted text-textMuted dark:border-border dark:text-muted-foreground cursor-pointer h-9"
              >
                <Info className="h-3.5 w-3.5 mr-1" />
                Lihat Syarat
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[475px] font-sans">
              <DialogHeader>
                <DialogTitle className="font-heading text-lg font-bold text-textMain dark:text-foreground flex items-center gap-2">
                  <StatusBadge status={getCategoryStatus(service.category)}>
                    {service.category}
                  </StatusBadge>
                  <span>{service.title}</span>
                </DialogTitle>
                <DialogDescription className="text-xs text-textMuted dark:text-muted-foreground pt-1.5 leading-relaxed">
                  {service.description}
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-textMain dark:text-foreground mb-3">
                  Persyaratan Dokumen Lengkap:
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {service.requirements.map((req, index) => (
                    <li key={index} className="flex gap-2.5 items-start text-xs sm:text-sm text-textMuted dark:text-muted-foreground leading-relaxed">
                      <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                        {index + 1}
                      </div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs font-sans">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-textMuted dark:text-muted-foreground tracking-wider">Estimasi Waktu</span>
                  <span className="font-semibold text-textMain dark:text-foreground">{service.duration}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase font-bold text-textMuted dark:text-muted-foreground tracking-wider">Biaya Pengurusan</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{service.cost}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2 border-t border-border pt-4">
                <Button
                  onClick={handleApply}
                  className="w-full gap-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Ajukan via WhatsApp
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            onClick={handleApply}
            className="rounded-xl text-[11px] font-bold cursor-pointer h-9"
          >
            <Send className="h-3.5 w-3.5 mr-1" />
            Ajukan WA
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
