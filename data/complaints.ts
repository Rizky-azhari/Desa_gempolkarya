import { ComplaintItem } from '@/types';

export const publicComplaints: ComplaintItem[] = [
  {
    id: 'c1',
    reporterName: 'Budi Santoso',
    title: 'Sampah Menumpuk di Saluran Irigasi Dusun I',
    description: 'Terdapat penumpukan sampah plastik yang menghambat aliran air ke sawah warga di dekat jembatan RW 02.',
    category: 'Kebersihan & Lingkungan',
    date: '2026-06-15',
    status: 'Selesai',
    response: 'Petugas kebersihan desa bersama warga sekitar telah melakukan kerja bakti pembersihan saluran air pada tanggal 17 Juni 2026. Aliran air kini kembali lancar.',
    responseDate: '2026-06-17'
  },
  {
    id: 'c2',
    reporterName: 'Siti Rahma',
    title: 'Lampu Penerangan Jalan Umum (PJU) Mati',
    description: 'Lampu penerangan di sepanjang jalan dekat batas desa Dusun II mati sejak seminggu lalu. Jalan menjadi gelap gulita saat malam hari.',
    category: 'Infrastruktur',
    date: '2026-06-18',
    status: 'Sedang Diproses',
    response: 'Laporan telah kami teruskan ke Dinas Perhubungan Kabupaten Karawang. Saat ini sedang dijadwalkan untuk perbaikan lampu PJU.',
    responseDate: '2026-06-19'
  },
  {
    id: 'c3',
    reporterName: 'Wawan Hermawan',
    title: 'Jalan Berlubang di Dekat Gapura Masuk Desa',
    description: 'Jalan aspal di sekitar gapura masuk desa Gempolkarya berlubang cukup dalam, membahayakan pengendara motor saat hujan.',
    category: 'Infrastruktur',
    date: '2026-06-17',
    status: 'Sedang Diproses',
    response: 'Akan dilakukan penambalan darurat dengan batu split minggu ini sebelum dilakukan pengaspalan permanen pada anggaran tahap berikutnya.',
    responseDate: '2026-06-18'
  },
  {
    id: 'c4',
    reporterName: 'Dewi Lestari',
    title: 'Saluran Air Bersih Posyandu Tersumbat',
    description: 'Fasilitas air bersih di Posyandu Melati II tidak mengalir karena sumbatan pada pipa paralon utama.',
    category: 'Fasilitas Umum',
    date: '2026-06-10',
    status: 'Selesai',
    response: 'Pipa paralon penyumbat telah diganti oleh staf bagian umum desa. Air bersih kini sudah mengalir normal untuk kegiatan posyandu.',
    responseDate: '2026-06-11'
  },
  {
    id: 'c5',
    reporterName: 'Rian Hidayat',
    title: 'Antrean Pelayanan Surat Administrasi Lambat',
    description: 'Pada hari Rabu kemarin, antrean pembuatan surat pengantar nikah memakan waktu hampir 2 jam karena petugas yang berjaga hanya 1 orang.',
    category: 'Pelayanan Publik',
    date: '2026-06-14',
    status: 'Belum Diproses'
  },
  {
    id: 'c6',
    reporterName: 'Agus Salim',
    title: 'Saran Penyuluhan Pupuk Organik untuk Pertanian',
    description: 'Warga petani mengharapkan diadakannya pelatihan pembuatan pupuk kompos mandiri guna menyiasati kelangkaan pupuk subsidi.',
    category: 'Pertanian',
    date: '2026-06-12',
    status: 'Selesai',
    response: 'Saran diterima dengan baik. Pemdes berkolaborasi dengan Balai Penyuluhan Pertanian (BPP) Tirtajaya akan menjadwalkan demo pembuatan kompos bulan depan.',
    responseDate: '2026-06-14'
  },
  {
    id: 'c7',
    reporterName: 'Hendra Wijaya',
    title: 'Penumpukan Material Pasir di Pinggir Jalan Utama',
    description: 'Ada material pasir pembangunan rumah warga diletakkan di badan jalan utama sehingga mempersempit akses kendaraan roda empat.',
    category: 'Ketertiban Umum',
    date: '2026-06-19',
    status: 'Sedang Diproses',
    response: 'Kepala Dusun I telah menegur warga pemilik material untuk segera memindahkan pasir ke halaman dalam waktu 2x24 jam.'
  },
  {
    id: 'c8',
    reporterName: 'Lina Marlina',
    title: 'Gangguan Keamanan & Keaktifan Ronda Malam',
    description: 'Mohon pengawasan linmas desa untuk mengontrol keaktifan pos ronda malam di wilayah RW 06 karena sering kosong saat dini hari.',
    category: 'Keamanan & Ketertiban',
    date: '2026-06-16',
    status: 'Belum Diproses'
  }
];
