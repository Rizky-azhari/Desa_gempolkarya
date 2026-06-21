"use client";

import { Breadcrumb } from "./Breadcrumb";
import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  description?: string;
  breadcrumbItems: { label: string; href?: string }[];
}

export function PageHero({ title, description, breadcrumbItems }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-verdun to-textMain text-eggshell py-12 md:py-20">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-smoke/20 via-transparent to-transparent opacity-60" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-orinoco/10 blur-3xl" />
      <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-smoke/10 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl flex flex-col gap-4">
          {/* Breadcrumbs with override text styling */}
          <div className="mb-2">
            <Breadcrumb
              items={breadcrumbItems}
              className="text-orinoco/90 [&_a]:text-orinoco/80 [&_a:hover]:text-eggshell [&_span]:text-eggshell"
            />
          </div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-orinoco/90 font-sans leading-relaxed max-w-2xl"
            >
              {description}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
