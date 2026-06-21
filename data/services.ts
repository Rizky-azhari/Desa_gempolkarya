import { ServiceItem } from '@/types';

export const publicServices: ServiceItem[] = [
  {
    id: 's1',
    title: 'Surat Pengantar Nikah (N1-N4)',
    description: 'Surat keterangan pengantar dari desa untuk mengurus administrasi pernikahan di Kantor Urusan Agama (KUA).',
    requirements: [
      'Surat pengantar RT/RW setempat',
      'Fotokopi KTP & KK calon pengantin (masing-masing 2 lembar)',
      'Fotokopi Akta Kelahiran & Ijazah terakhir',
      'Pas foto ukuran 2x3 (4 lembar) dan 3x4 (4 lembar) berlatar belakang biru',
      'Fotokopi KTP orang tua calon pengantin',
      'Surat Pernyataan Belum Pernah Menikah (bermaterai Rp10.000)'
    ],
    duration: '1-2 Hari Kerja',
    cost: 'Gratis',
    category: 'Administrasi'
  },
  {
    id: 's2',
    title: 'Surat Keterangan Tidak Mampu (SKTM)',
    description: 'Surat keterangan untuk warga kurang mampu guna pengajuan keringanan biaya sekolah, beasiswa, atau jaminan kesehatan.',
    requirements: [
      'Surat pengantar RT/RW setempat',
      'Fotokopi KTP & KK kepala keluarga',
      'Fotokopi KTP pemohon',
      'Surat pernyataan miskin dari yang bersangkutan diketahui RT/RW',
      'Foto kondisi rumah tinggal tampak depan'
    ],
    duration: 'Same Day (1 Jam)',
    cost: 'Gratis',
    category: 'Kesejahteraan'
  },
  {
    id: 's3',
    title: 'Surat Keterangan Usaha (SKU)',
    description: 'Surat keterangan resmi yang menyatakan bahwa pemohon benar memiliki usaha mikro/kecil aktif di wilayah Desa Citimun.',
    requirements: [
      'Surat pengantar RT/RW setempat',
      'Fotokopi KTP & KK pemohon',
      'Foto aktivitas tempat usaha',
      'Mengisi formulir jenis usaha & lokasi usaha di kantor desa'
    ],
    duration: 'Same Day (1 Jam)',
    cost: 'Gratis',
    category: 'Umum'
  },
  {
    id: 's4',
    title: 'Pengantar Kartu Keluarga (KK) & KTP',
    description: 'Surat pengantar untuk pengajuan pembuatan baru, perubahan data, atau kehilangan KK/KTP di tingkat Kecamatan.',
    requirements: [
      'Surat pengantar RT/RW setempat',
      'KK asli (untuk pembaruan/pecah KK)',
      'Fotokopi Akta Kelahiran/Buku Nikah',
      'Surat Kehilangan dari Kepolisian (jika hilang)',
      'Fotokopi Ijazah (jika ada perubahan gelar/data)'
    ],
    duration: 'Same Day (30 Menit)',
    cost: 'Gratis',
    category: 'Kependudukan'
  },
  {
    id: 's5',
    title: 'Surat Keterangan Domisili Usaha / Tinggal',
    description: 'Surat resmi yang menerangkan domisili tempat tinggal seseorang atau lokasi operasional sebuah badan usaha.',
    requirements: [
      'Surat pengantar RT/RW setempat',
      'Fotokopi KTP & KK pemohon',
      'Bukti kepemilikan tanah/bangunan atau surat perjanjian sewa menyewa',
      'Fotokopi pelunasan PBB tahun berjalan'
    ],
    duration: '1 Hari Kerja',
    cost: 'Gratis',
    category: 'Administrasi'
  },
  {
    id: 's6',
    title: 'Surat Keterangan Kelahiran',
    description: 'Surat keterangan resmi kelahiran anak sebagai dasar pengajuan Akta Kelahiran di Disdukcapil.',
    requirements: [
      'Surat pengantar RT/RW setempat',
      'Surat kelahiran dari Bidan/Dokter/RS asli',
      'Fotokopi Buku Nikah orang tua (legalisir)',
      'Fotokopi KK & KTP orang tua pemohon',
      'Fotokopi KTP 2 orang saksi kelahiran'
    ],
    duration: 'Same Day (1 Jam)',
    cost: 'Gratis',
    category: 'Kependudukan'
  },
  {
    id: 's7',
    title: 'Surat Keterangan Kematian',
    description: 'Surat keterangan resmi kematian warga untuk pengurusan akta kematian, waris, penutupan rekening bank, dsb.',
    requirements: [
      'Surat pengantar RT/RW setempat',
      'Surat kematian dari Rumah Sakit/Dokter (jika meninggal di RS)',
      'KK & KTP asli orang yang meninggal',
      'Fotokopi KTP ahli waris / pelapor',
      'Fotokopi KTP 2 orang saksi kematian'
    ],
    duration: 'Same Day (1 Jam)',
    cost: 'Gratis',
    category: 'Kependudukan'
  },
  {
    id: 's8',
    title: 'Surat Pengantar Catatan Kepolisian (SKCK)',
    description: 'Surat pengantar keterangan kelakuan baik dari desa untuk melengkapi pengajuan SKCK di tingkat Polsek/Polres.',
    requirements: [
      'Surat pengantar RT/RW setempat',
      'Fotokopi KTP & KK pemohon',
      'Fotokopi Akta Kelahiran atau Ijazah terakhir',
      'Pas foto ukuran 4x6 (2 lembar) berlatar belakang merah'
    ],
    duration: 'Same Day (30 Menit)',
    cost: 'Gratis',
    category: 'Administrasi'
  }
];
