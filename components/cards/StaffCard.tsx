"use client";

import { Mail, Shield } from "lucide-react";
import { StaffMember } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StaffCardProps {
  member: StaffMember;
}

export function StaffCard({ member }: StaffCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="overflow-hidden border border-orinoco/30 dark:border-border/60 bg-cardSoft dark:bg-card shadow-sm hover:shadow-md transition-all h-full text-center flex flex-col items-center">
        {/* Photo Container */}
        <CardHeader className="p-0 w-full relative pt-[125%] overflow-hidden bg-muted">
          <img
            src={member.photo}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </CardHeader>

        {/* Info Area */}
        <CardContent className="p-5 flex flex-col items-center gap-1.5 w-full flex-1 min-w-0">
          <div className="inline-flex items-center justify-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full dark:bg-primary/20 dark:text-accent-foreground text-[10px] uppercase font-bold tracking-wider font-sans mb-1.5 max-w-full leading-normal">
            <Shield className="h-3 w-3 shrink-0" />
            <span className="break-words leading-tight text-center">{member.role}</span>
          </div>

          <h3 className="font-heading text-base font-bold text-textMain dark:text-foreground line-clamp-2 leading-snug text-center">
            {member.name}
          </h3>

          {member.nip && (
            <p className="text-[11px] text-textMuted dark:text-muted-foreground font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-2" title={`NIP. ${member.nip}`}>
              NIP. {member.nip}
            </p>
          )}

          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="mt-2 inline-flex items-center justify-center gap-1.5 text-xs text-textMuted hover:text-primary dark:text-muted-foreground dark:hover:text-foreground font-sans transition-colors max-w-full px-2"
              title={member.email}
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{member.email}</span>
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
