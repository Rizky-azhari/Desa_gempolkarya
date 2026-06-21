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
        <CardContent className="p-5 flex flex-col items-center gap-1.5 w-full flex-1">
          <div className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-0.5 rounded-full dark:bg-primary/20 dark:text-accent-foreground text-[10px] uppercase font-bold tracking-wider font-sans mb-1">
            <Shield className="h-3 w-3" />
            {member.role}
          </div>

          <h3 className="font-heading text-base font-bold text-textMain dark:text-foreground line-clamp-1 leading-snug">
            {member.name}
          </h3>

          {member.nip && (
            <p className="text-[11px] text-textMuted dark:text-muted-foreground font-mono">
              NIP. {member.nip}
            </p>
          )}

          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs text-textMuted hover:text-primary dark:text-muted-foreground dark:hover:text-foreground font-sans transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate max-w-[180px]">{member.email}</span>
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
