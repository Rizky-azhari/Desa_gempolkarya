import { z } from "zod";

export const emailSchema = z.string().email("Format email tidak valid");

export const whatsappSchema = z
  .string()
  .min(8, "Nomor WhatsApp minimal 8 digit")
  .regex(/^\d+$/, "Nomor WhatsApp hanya boleh berupa angka");

export const complaintSchema = z.object({
  title: z.string().min(1, "Judul laporan tidak boleh kosong"),
  description: z.string().min(1, "Isi laporan tidak boleh kosong"),
  category: z.string().min(1, "Kategori wajib dipilih"),
  whatsapp: whatsappSchema,
});

export const userCreateSchema = z.object({
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.string().min(1, "Role wajib dipilih"),
  status: z.enum(["Aktif", "Nonaktif"]),
});

export const userEditSchema = z.object({
  name: z.string().min(1, "Nama lengkap wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  role: z.string().min(1, "Role wajib dipilih"),
  status: z.enum(["Aktif", "Nonaktif"]),
});
