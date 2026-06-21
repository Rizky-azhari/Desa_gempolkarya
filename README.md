# Portal Resmi Pemerintah Desa Gempolkarya

Portal digital terintegrasi untuk keterbukaan informasi, pelayanan publik mandiri, dan panel tata kelola internal Pemerintah Desa Gempolkarya, Kecamatan Tirtajaya, Kabupaten Karawang, Jawa Barat.

Aplikasi ini dibangun menggunakan teknologi modern berbasis web dengan arsitektur headless yang terhubung langsung ke backend & database cloud.

---

## 🚀 Fitur Utama

### 🏛️ 1. Halaman Publik (Tanpa Login)
Halaman depan yang dapat diakses oleh seluruh warga dan masyarakat umum secara responsif:
*   **Beranda Utama**: Tampilan landing page premium dengan ringkasan data kependudukan, berita terbaru, dan profil singkat desa.
*   **Profil Desa**: Memuat sejarah asal-usul desa, visi misi pembangunan, serta letak geografis wilayah.
*   **Aparatur Pemerintahan**: Menampilkan struktur organisasi dan data resmi perangkat serta lembaga desa (BPD, LPM, PKK, Karang Taruna).
*   **Data Demografi**: Visualisasi statistik kependudukan yang interaktif berdasarkan jenis kelamin, tingkat pendidikan, mata pencaharian, kelompok usia, dan agama.
*   **Layanan Publik**: Informasi lengkap mengenai jenis surat administratif (SKU, SKTM, Domisili, dll) beserta persyaratan berkas pengajuannya.
*   **Portal Berita & Kegiatan**: Publikasi artikel pembangunan, kegiatan kemasyarakatan, dan pengumuman resmi desa.
*   **Direktori UMKM**: Promosi digital produk unggulan usaha warga desa yang terhubung langsung ke kontak WhatsApp penjual.
*   **Peta Kewilayahan (RT/RW)**: Peta interaktif koordinat lokasi kantor RW dan RT beserta kontak para ketua lingkungan.
*   **Pengaduan Online**: Formulir pelaporan warga untuk menyampaikan saran, aduan, atau keluhan lingkungan secara anonim maupun terbuka lengkap dengan unggah bukti foto.

### 🔐 2. Dashboard Internal (Wajib Login)
Panel administrasi terproteksi bagi perangkat desa untuk mengelola data operasional secara real-time:
*   **Autentikasi Terisolasi (Independent Tab Session)**: Sesi login disimpan secara mandiri pada `sessionStorage` masing-masing tab browser. Memungkinkan pengelola masuk dengan banyak peran berbeda sekaligus di tab berbeda tanpa terjadi kebocoran sesi cookie.
*   **Manajemen Konten Publik**: CRUD (Create, Read, Update, Delete) dinamis untuk data UMKM, Portal Berita, Galeri Kegiatan, Data RT/RW, dan Data Aparatur Desa.
*   **Pengolahan Pengaduan**: Fitur tindak lanjut pengaduan warga, pembaruan status laporan (Dikirim ➡️ Diproses ➡️ Ditindaklanjuti ➡️ Selesai), serta penghapusan laporan yang tidak valid.
*   **Kelola Pengguna (Khusus Super Admin)**: Registrasi, pemblokiran status (Aktif/Nonaktif), pembaruan data kredensial, dan penyesuaian hak akses bagi staf pengelola internal.
*   **Akses Kontrol Berbasis Peran (RBAC)**: Pembatasan akses halaman dashboard secara dinamis berdasarkan 4 peran utama:
    *   *Super Admin* (Akses penuh + Manajemen Pengguna & Log Sistem)
    *   *Admin Desa* (Mengelola Profil, Layanan, Berita, UMKM, Galeri, & Pengaduan)
    *   *Kepala Desa* (Memonitor Dashboard, Data Demografi, Layanan, Pengaduan, Berita, & UMKM)
    *   *Sekretaris Desa* (Mengelola Data Demografi, Layanan, Aparatur, & RT/RW)
*   **Log Aktivitas Sistem**: Pencatatan riwayat setiap aksi krusial yang dilakukan staf di dashboard (seperti menambah data, mengubah status, atau menghapus laporan) guna menjaga audit sistem yang transparan.
*   **Theme Toggle (Mode Gelap/Terang)**: Penyesuaian tampilan visual dashboard agar nyaman di mata saat digunakan siang maupun malam hari.

---

## 🛠️ Stack Teknologi

*   **Framework Utama**: Next.js (App Router) & React
*   **Bahasa Pemrograman**: TypeScript
*   **Gaya & Desain (UI/UX)**: Tailwind CSS, Shadcn UI, Framer Motion (Animasi), Lucide React (Ikon)
*   **Visualisasi Data**: Recharts (Grafik Demografi Kependudukan)
*   **Backend & Database Service**: Supabase (Auth, PostgreSQL Database, Cloud Storage)
*   **Notifikasi**: Sonner (Toast Notifications)

---

## ⚙️ Petunjuk Instalasi Lokal

### 1. Prasyarat
Pastikan Anda sudah menginstal **Node.js** (versi 18+) di komputer Anda.

### 2. Kloning Repositori
```bash
git clone https://github.com/username/desa_gempolkarya.git
cd desa_gempolkarya
```

### 3. Konfigurasi Environment Variables (`.env.local`)
Buat berkas `.env.local` di folder root proyek dan lengkapi variabel berikut menggunakan kredensial proyek Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anonymous-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 4. Instalasi Dependensi
```bash
npm install
```

### 5. Menjalankan Server Pengembangan (Lokal)
Jalankan server lokal dengan perintah berikut:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasilnya secara lokal.

### 6. Build Produksi
Untuk mengecek kepatuhan kode dan membuild aplikasi menjadi bundel siap tayang (*production-ready*):
```bash
npm run build
```
Distribusi output akan dibuat secara otomatis di dalam direktori `.next/`.

---

## 📁 Struktur Folder Utama

*   `app/` - Direktori halaman Next.js App Router (Rute publik & dashboard).
*   `app/api/` - Endpoint serverless route handler (Upload, Manajemen pengguna auth, & Log aktivitas).
*   `components/` - Komponen UI/UX modular reusable (Shadcn & Custom layouts).
*   `data/` - Data statis profil desa (slogan, alamat, peta embed, dsb).
*   `lib/` - Helper fungsi, otorisasi peran (RBAC), validator skema Zod, dan pencatat aktivitas.
*   `supabase/` - Skema tabel SQL (`schema.sql`), kebijakan RLS (`storage-policies.sql`), dan data benih awal (`seed.sql`).
*   `utils/` - Inisialisasi client dan server Supabase SDK.
