import { VillageProfile, DemographicData } from '@/types';

export const villageProfile: VillageProfile = {
  name: 'Gempolkarya',
  district: 'Tirtajaya',
  regency: 'Karawang',
  province: 'Jawa Barat',
  address: 'Jl. Raya Gempolkarya No. 01, Kecamatan Tirtajaya, Kabupaten Karawang, Jawa Barat 41358',
  phone: '(0267) 840123',
  email: 'pemdes.gempolkarya@example.go.id',
  whatsapp: '6281234567890',
  slogan: 'Desa Maju, Hijau, Mandiri, dan Melayani',
  vision: 'Mewujudkan Desa Gempolkarya yang Sejahtera, Mandiri, Berwawasan Lingkungan, serta Unggul dalam Pelayanan Publik.',
  mission: [
    'Meningkatkan tata kelola pemerintahan desa yang partisipatif, transparan, dan berorientasi pelayanan prima.',
    'Mendorong kelestarian lingkungan hidup menuju desa yang hijau, rindang, dan bersih.',
    'Meningkatkan kemandirian ekonomi desa melalui optimalisasi potensi pertanian, pariwisata, dan BUMDes.',
    'Memperkuat infrastruktur jalan, sanitasi, dan fasilitas umum desa secara berkelanjutan.',
    'Membina toleransi dan kerukunan beragama serta melestarikan kebudayaan lokal Jawa Barat.'
  ],
  history: 'Desa Gempolkarya terletak di Kecamatan Tirtajaya, Kabupaten Karawang. Desa ini berawal dari pemukiman tradisional yang dikenal dengan sektor pertaniannya yang subur. Secara resmi diakui sejak dahulu, Gempolkarya terus berkembang menjadi desa mandiri yang progresif. Slogan Desa Maju, Hijau, Mandiri, dan Melayani mencerminkan semangat warga untuk terus melangkah maju tanpa melupakan keasrian alam dan pelayanan warga yang prima.',
  geographic: {
    area: '425 Hektar',
    borders: {
      north: 'Laut Jawa / Selat Sunda',
      south: 'Desa Pisangsambo',
      east: 'Desa Medankarya',
      west: 'Desa Sumurgede'
    },
    topography: 'Kawasan pesisir dan dataran rendah dengan sektor pertanian dan sawah produktif.'
  },
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.5750058474246!2d107.240728!3d-5.984572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a256a6da4bfbb%3A0x7d6f51cb7e42d765!2sGempolkarya%2C%20Tirtajaya%2C%20Karawang%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1718872134512!5m2!1sen!2sid',
  statistics: {
    population: '4.826 jiwa',
    households: '1.392 KK',
    rtCount: 24,
    rwCount: 8,
    areaSize: '425 Ha'
  }
};

export const demographicStats: DemographicData = {
  gender: [
    { name: 'Laki-laki', value: 2431, percentage: '50.4%' },
    { name: 'Perempuan', value: 2395, percentage: '49.6%' }
  ],
  education: [
    { level: 'Tidak Sekolah', count: 266 },
    { level: 'SD/Sederajat', count: 1520 },
    { level: 'SMP/Sederajat', count: 1240 },
    { level: 'SMA/Sederajat', count: 1410 },
    { level: 'Diploma (D1-D4)', count: 180 },
    { level: 'Sarjana (S1-S3)', count: 210 }
  ],
  job: [
    { title: 'Petani / Kebun', count: 1650 },
    { title: 'Karyawan Swasta', count: 1220 },
    { title: 'Wiraswasta / UMKM', count: 880 },
    { title: 'PNS / TNI / POLRI', count: 120 },
    { title: 'Pelajar / Mahasiswa', count: 730 },
    { title: 'Belum / Tidak Bekerja', count: 226 }
  ],
  ageGroup: [
    { range: '0 - 5 tahun', count: 390 },
    { range: '6 - 12 tahun', count: 530 },
    { range: '13 - 18 tahun', count: 480 },
    { range: '19 - 35 tahun', count: 1450 },
    { range: '36 - 50 tahun', count: 1190 },
    { range: '51 - 65 tahun', count: 610 },
    { range: '66+ tahun', count: 176 }
  ]
};

export const mainSummaryCards = [
  { label: 'Total Penduduk', value: '4.826', desc: 'Jiwa terdaftar', trend: '+1.4% thn ini' },
  { label: 'Jumlah KK', value: '1.392', desc: 'Kepala Keluarga', trend: 'Rata-rata 3.4 jiwa/KK' },
  { label: 'Luas Wilayah', value: '425 Ha', desc: 'Pertanian & Pemukiman', trend: 'Hawa sejuk pegunungan' },
  { label: 'Rukun Tangga', value: '24 RT / 8 RW', desc: 'Unit Kewilayahan', trend: '8 RW Administratif' }
];
