"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon, TreePine, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { villageProfile } from "@/data/village";

const mainNavItems = [
  { label: "Beranda", href: "/" },
  { label: "Profil", href: "/profil" },
  { label: "Pemerintahan", href: "/pemerintahan" },
  { label: "Layanan", href: "/layanan" },
  { label: "Data Desa", href: "/data-desa" },
  { label: "Pengaduan", href: "/pengaduan" },
  { label: "Berita", href: "/berita" },
];

const dropdownNavItems = [
  { label: "Peta RT/RW", href: "/peta-rt-rw" },
  { label: "Potensi Desa", href: "/potensi" },
  { label: "UMKM Warga", href: "/umkm" },
  { label: "Galeri Foto", href: "/galeri" },
];

const allMobileNavItems = [
  { label: "Beranda", href: "/" },
  { label: "Profil Desa", href: "/profil" },
  { label: "Pemerintahan", href: "/pemerintahan" },
  { label: "Layanan Publik", href: "/layanan" },
  { label: "Data Desa", href: "/data-desa" },
  { label: "Peta RT/RW", href: "/peta-rt-rw" },
  { label: "Pengaduan Laporan", href: "/pengaduan" },
  { label: "Berita & Kegiatan", href: "/berita" },
  { label: "Potensi Wilayah", href: "/potensi" },
  { label: "Direktori UMKM", href: "/umkm" },
  { label: "Galeri Foto", href: "/galeri" },
  { label: "Kontak Kami", href: "/kontak" },
];

export function Navbar() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/dashboard") || pathname === "/login") {
    return null;
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isDropdownActive = dropdownNavItems.some(item => pathname === item.href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
            <TreePine className="h-6 w-6 text-eggshell dark:text-background" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-tight text-textMain dark:text-foreground leading-none">
              Desa {villageProfile.name}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-textMuted dark:text-muted-foreground mt-0.5 font-sans leading-none">
              Kec. {villageProfile.district}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-2 xl:mx-12 font-sans">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-xs font-semibold transition-colors hover:text-primary rounded-xl whitespace-nowrap",
                  isActive
                    ? "text-primary bg-primary/5 dark:bg-primary/10"
                    : "text-textMuted hover:text-textMain dark:text-muted-foreground dark:hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className={cn(
                "px-3 py-2 text-xs font-semibold transition-colors hover:text-primary flex items-center gap-1 rounded-xl cursor-pointer whitespace-nowrap",
                isDropdownActive
                  ? "text-primary bg-primary/5 dark:bg-primary/10"
                  : "text-textMuted hover:text-textMain dark:text-muted-foreground dark:hover:text-foreground"
              )}
            >
              <span>Info & Media</span>
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 pt-2 w-44 z-50 animate-in fade-in-50 slide-in-from-top-1 duration-150">
                <div className="rounded-2xl bg-card border border-orinoco/40 dark:border-border/60 shadow-lg p-1.5 flex flex-col gap-0.5">
                  {dropdownNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "px-3 py-2 text-xs rounded-xl transition-all whitespace-nowrap",
                          isActive
                            ? "bg-primary text-primary-foreground font-bold"
                            : "text-textMuted hover:bg-muted/50 hover:text-textMain dark:text-muted-foreground dark:hover:text-foreground"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/kontak"
            className={cn(
              "px-3 py-2 text-xs font-semibold transition-colors hover:text-primary rounded-xl whitespace-nowrap",
              pathname === "/kontak"
                ? "text-primary bg-primary/5 dark:bg-primary/10"
                : "text-textMuted hover:text-textMain dark:text-muted-foreground dark:hover:text-foreground"
            )}
          >
            Kontak
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Dashboard Button */}
          <Link href="/login" className="hidden lg:block">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl text-xs h-9 border-[#48521C]/25 text-[#48521C] hover:bg-[#FCFFF5] hover:text-[#48521C] cursor-pointer font-bold px-3 transition-colors"
            >
              Dashboard
            </Button>
          </Link>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl hover:bg-muted/80 h-9 w-9 cursor-pointer"
            aria-label="Toggle Theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-textMain" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
          </Button>

          {/* Quick Contact Button */}
          <Button
            asChild
            variant="default"
            size="sm"
            className="hidden lg:flex gap-2 rounded-xl text-xs h-9 cursor-pointer"
          >
            <a
              href={`https://wa.me/${villageProfile.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="h-4 w-4" />
              <span>Hubungi Kami</span>
            </a>
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden rounded-xl hover:bg-muted/80 h-9 w-9 cursor-pointer"
                aria-label="Open Mobile Menu"
              >
                <Menu className="h-5 w-5 text-textMain dark:text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-6 overflow-y-auto">
              <SheetTitle className="text-left font-heading text-xl font-bold mb-4 text-textMain dark:text-foreground flex items-center gap-2 border-b border-border/30 pb-3">
                <TreePine className="h-5 w-5 text-primary" /> Menu Gempolkarya
              </SheetTitle>
              <div className="flex flex-col gap-2 mt-4 font-sans">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#48521C] bg-[#FCFFF5] border border-[#48521C]/20 hover:bg-[#48521C]/5 transition-all mb-2"
                >
                  Dashboard Internal
                </Link>
                {allMobileNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-textMuted hover:bg-muted/50 hover:text-textMain dark:text-muted-foreground dark:hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="border-t border-border/50 pt-4 mt-4">
                  <Button
                    asChild
                    variant="default"
                    className="w-full gap-2 rounded-xl text-xs h-10 cursor-pointer"
                  >
                    <a
                      href={`https://wa.me/${villageProfile.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Phone className="h-4 w-4" />
                      <span>WhatsApp Layanan</span>
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
