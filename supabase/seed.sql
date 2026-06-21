-- Seed Village Profile
insert into public.village_profile (
  id, name, slogan, address, phone, whatsapp, email, service_hours, history, vision, mission, geography,
  north_boundary, south_boundary, east_boundary, west_boundary, area_size, population_total, family_total,
  rt_total, rw_total, male_total, female_total, latitude, longitude, map_embed_url, image_url
) values (
  '00000000-0000-0000-0000-000000000001',
  'Gempolkarya',
  'Desa Maju, Hijau, Mandiri, dan Melayani',
  'Jl. Raya Gempolkarya No. 01, Kecamatan Tirtajaya, Kabupaten Karawang, Jawa Barat 41358',
  '(0267) 840123',
  '6281234567890',
  'pemdes.gempolkarya@example.go.id',
  'Senin - Jumat, 08.00 - 15.00 WIB',
  'Desa Gempolkarya terletak di Kecamatan Tirtajaya, Kabupaten Karawang. Desa ini berawal dari pemukiman tradisional yang dikenal dengan sektor pertaniannya yang subur. Secara resmi diakui sejak dahulu, Gempolkarya terus berkembang menjadi desa mandiri yang progresif.',
  'Mewujudkan Desa Gempolkarya yang Sejahtera, Mandiri, Berwawasan Lingkungan, serta Unggul dalam Pelayanan Publik.',
  '{"Meningkatkan tata kelola pemerintahan desa yang partisipatif, transparan, dan berorientasi pelayanan prima.","Mendorong kelestarian lingkungan hidup menuju desa yang hijau, rindang, dan bersih.","Meningkatkan kemandirian ekonomi desa melalui optimalisasi potensi pertanian, pariwisata, dan BUMDes.","Memperkuat infrastruktur jalan, sanitasi, dan fasilitas umum desa secara berkelanjutan.","Membina toleransi dan kerukunan beragama serta melestarikan kebudayaan lokal Jawa Barat."}',
  'Kawasan pesisir dan dataran rendah dengan sektor pertanian dan sawah produktif.',
  'Laut Jawa / Selat Sunda',
  'Desa Pisangsambo',
  'Desa Medankarya',
  'Desa Sumurgede',
  '425 Ha',
  4826,
  1392,
  24,
  8,
  2431,
  2395,
  -5.984572,
  107.240728,
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.5750058474246!2d107.240728!3d-5.984572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6a256a6da4bfbb%3A0x7d6f51cb7e42d765!2sGempolkarya%2C%20Tirtajaya%2C%20Karawang%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1718872134512!5m2!1sen!2sid',
  'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&q=80&w=1200'
);

-- Seed Services (8 Services)
insert into public.services (title, slug, description, requirements, estimated_time, icon, is_active) values
('Surat Pengantar Kartu Keluarga', 'surat-pengantar-kk', 'Surat pengantar untuk pembuatan baru, perbaikan, atau perubahan data Kartu Keluarga (KK).', '{"Surat pengantar RT/RW","Fotokopi KK lama","KTP pemohon","Fotokopi Akta Kelahiran atau surat nikah"}', '1 Hari Kerja', 'FileText', true),
('Surat Keterangan KTP-el', 'surat-keterangan-ktp', 'Surat keterangan sementara sebagai pengganti KTP-el yang rusak, hilang, atau dalam proses pembuatan.', '{"Surat pengantar RT/RW","Fotokopi Kartu Keluarga","Surat kehilangan dari Kepolisian jika hilang","Pas foto 3x4 (2 lembar)"}', '1 Hari Kerja', 'CreditCard', true),
('Surat Keterangan Domisili', 'surat-keterangan-domisili', 'Surat keterangan resmi yang menyatakan tempat tinggal atau domisili seseorang di Desa Gempolkarya.', '{"Surat pengantar RT/RW","Fotokopi KTP dan KK pemohon","Surat pernyataan jaminan tempat tinggal (warga pendatang)"}', '1 Hari Kerja', 'MapPin', true),
('Surat Keterangan Usaha (SKU)', 'surat-keterangan-usaha', 'Surat keterangan resmi untuk pelaku usaha mikro, kecil, dan menengah (UMKM) untuk pengajuan modal atau legalitas.', '{"Surat pengantar RT/RW","Fotokopi KTP dan KK","Surat pernyataan bermaterai dari pemohon tentang usaha","Foto tempat usaha"}', '1 Hari Kerja', 'Briefcase', true),
('Surat Keterangan Tidak Mampu (SKTM)', 'surat-keterangan-tidak-mampu', 'Surat keterangan untuk keringanan biaya pengobatan, sekolah, atau pengajuan bantuan sosial.', '{"Surat pengantar RT/RW","Fotokopi KTP dan KK","Surat pernyataan tidak mampu bermaterai disaksikan tetangga","Fotokopi kartu jaminan kesehatan jika ada"}', '1 Hari Kerja', 'FileCheck', true),
('Surat Keterangan Kematian', 'surat-keterangan-kematian', 'Surat pernyataan resmi atas meninggalnya seorang warga untuk pengurusan akta kematian dan waris.', '{"Surat pengantar RT/RW","Fotokopi KTP & KK almarhum","Surat dokter/rumah sakit atau saksi kematian","Fotokopi KTP pelapor"}', '1 Hari Kerja', 'FileMinus', true),
('Surat Keterangan Kelahiran', 'surat-keterangan-kelahiran', 'Surat keterangan kelahiran warga baru di Desa Gempolkarya sebagai prasyarat membuat Akta Kelahiran.', '{"Surat pengantar RT/RW","Surat kelahiran dari bidan/dokter almarhum/klinik","Fotokopi KTP & KK orang tua","Fotokopi buku nikah/akta perkawinan"}', '1 Hari Kerja', 'UserPlus', true),
('Surat Izin Keramaian', 'surat-izin-keramaian', 'Surat pengantar izin mengadakan acara besar yang mendatangkan massa (resepsi nikah, pentas seni, dll).', '{"Surat pengantar RT/RW","Fotokopi KTP penyelenggara","Pernyataan persetujuan tetangga kiri kanan","Rencana susunan acara"}', '2 Hari Kerja', 'Calendar', true);

-- Seed News (6 News Items)
insert into public.news (title, slug, category, excerpt, content, image_url, status) values
('Pembangunan Saluran Irigasi Baru Sawah Gempolkarya', 'pembangunan-saluran-irigasi-baru', 'Pembangunan', 'Pemerintah desa Gempolkarya membangun saluran irigasi baru sepanjang 800 meter untuk mendukung sektor pertanian.', 'Pemerintah Desa Gempolkarya memulai pembangunan saluran irigasi beton baru sepanjang 800 meter yang melintasi areal persawahan Blok C. Proyek ini didanai melalui Alokasi Dana Desa (ADD) tahun anggaran berjalan guna mengatasi masalah kekeringan saat musim kemarau dan mengoptimalkan hasil panen padi warga.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800', 'published'),
('Penyaluran Bantuan Pangan Cadangan Beras Pemerintah', 'penyaluran-bantuan-pangan-cadangan-beras', 'Pengumuman', 'Sebanyak 350 Kepala Keluarga menerima bantuan pangan cadangan beras pemerintah untuk menjaga stabilitas pangan.', 'Pemerintah Desa Gempolkarya mendistribusikan bantuan pangan berupa beras seberat 10 kg per kepala keluarga kepada warga yang terdaftar dalam Data Terpadu Kesejahteraan Sosial (DTKS). Kegiatan penyaluran ini dilakukan di aula kantor desa dengan tertib dan diawasi langsung oleh Babinsa.', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800', 'published'),
('Pelatihan Digitalisasi UMKM Kuliner Warga Gempolkarya', 'pelatihan-digitalisasi-umkm-kuliner', 'Kegiatan', 'Warga desa mengikuti pelatihan pemasaran digital dan packaging makanan untuk menaikkan kelas UMKM lokal.', 'Dalam rangka meningkatkan kapasitas ekonomi desa, TP-PKK bekerja sama dengan Dinas Koperasi dan UMKM Kabupaten Karawang mengadakan lokakarya pelatihan digitalisasi pemasaran produk kuliner. Peserta diajarkan teknik foto produk, pendaftaran Google Maps Bisnis, dan pembuatan toko online sederhana.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800', 'published'),
('Jadwal Pelayanan Posyandu Balita dan Lansia Juni 2026', 'jadwal-pelayanan-posyandu-juni-2026', 'Pengumuman', 'Informasi jadwal dan titik lokasi layanan kesehatan gratis Posyandu balita dan lansia di wilayah dusun.', 'Diberitahukan kepada seluruh warga Desa Gempolkarya bahwa pelayanan posyandu terpadu untuk pemeriksaan tumbuh kembang balita dan kesehatan lansia akan dilaksanakan mulai tanggal 15 hingga 20 Juni di masing-masing pos dusun. Diharapkan kehadiran ibu menyusui dan warga lansia untuk pemeriksaan rutin gratis.', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800', 'published'),
('Pembersihan Pantai dan Penanaman Mangrove Tirtajaya', 'pembersihan-pantai-dan-penanaman-mangrove', 'Kegiatan', 'Aksi peduli lingkungan pesisir Karawang dengan menanam 500 pohon bibit mangrove bersama komunitas pemuda.', 'Karang Taruna Desa Gempolkarya berkolaborasi dengan komunitas pencinta alam melaksanakan aksi gotong royong pembersihan sampah plastik di kawasan pesisir sekaligus melakukan penanaman 500 bibit pohon mangrove baru. Langkah mitigasi abrasi ini didukung penuh oleh Dinas Kehutanan Jawa Barat.', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800', 'published'),
('Rencana Rapat Anggaran Pendapatan Desa APBDes 2026', 'rencana-rapat-anggaran-pendapatan-apbdes', 'Berita Utama', 'Undangan terbuka bagi tokoh masyarakat untuk menghadiri Musrenbangdes pembahasan rencana APBDes.', 'Pemerintah Desa mengundang perwakilan RT, RW, tokoh agama, dan tokoh pemuda dalam musyawarah perencanaan pembangunan desa (Musrenbangdes) guna membahas prioritas penggunaan dana desa dan rancangan APBDes tahun mendatang. Transparansi anggaran merupakan kunci tata kelola Gempolkarya.', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800', 'published');

-- Seed Officials (15 Staff Members)
insert into public.officials (name, position, task_area, phone, photo_url, category, sort_order) values
('H. Ujang Suherman', 'Kepala Desa', 'Pemerintahan Umum', '6281234567890', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300', 'Perangkat', 1),
('Ahmad Fauzi, S.IP', 'Sekretaris Desa', 'Administrasi & Keuangan', '6282234567890', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300', 'Perangkat', 2),
('Siti Aminah', 'Kepala Urusan Keuangan', 'Anggaran & Bendahara', '6283234567890', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300', 'Perangkat', 3),
('Budi Hartono', 'Kepala Urusan Tata Usaha', 'Surat Menyurat & Arsip', '6284234567890', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300', 'Perangkat', 4),
('Dede Rustandi', 'Kepala Seksi Pemerintahan', 'Administrasi Penduduk', '6285234567890', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300', 'Perangkat', 5),
('Wawan Kurniawan', 'Kepala Seksi Kesejahteraan', 'Sosial & Bantuan', '6286234567890', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300', 'Perangkat', 6),
('Lilis Karlina', 'Kepala Seksi Pelayanan', 'Layanan Masyarakat', '6287234567890', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300', 'Perangkat', 7),
('Rahmat Hidayat', 'Kepala Dusun I', 'Dusun Krajan', '6288234567890', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300', 'Kewilayahan', 8),
('Dadang Subagja', 'Kepala Dusun II', 'Dusun Kalijaya', '6289234567890', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300', 'Kewilayahan', 9),
('Endang Suhendar', 'Kepala Dusun III', 'Dusun Gempol Tengah', '6290234567890', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300', 'Kewilayahan', 10),
('Dra. Hj. Nunung', 'Ketua BPD', 'Badan Permusyawaratan Desa', '6291234567890', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300', 'Lembaga', 11),
('Ir. H. Mulyana', 'Wakil Ketua BPD', 'Lembaga Permusyawaratan', '6292234567890', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300', 'Lembaga', 12),
('Hj. Ratna Sari', 'Ketua TP-PKK', 'Pemberdayaan Kesejahteraan', '6293234567890', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=300', 'Lembaga', 13),
('Cecep Mulyadi', 'Ketua Karang Taruna', 'Kepemudaan & Olahraga', '6294234567890', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=300', 'Lembaga', 14),
('Ustadz Yusuf', 'Ketua MUI Desa', 'Kerohanian & Agama', '6295234567890', 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&q=80&w=300', 'Lembaga', 15);

-- Seed RT/RW Locations (12 Locations)
insert into public.rtrw_locations (rw, rt, leader_name, phone, area_name, address, latitude, longitude, map_url) values
('01', '01', 'Bp. Karsan', '628121111001', 'Dusun Krajan', 'RT 01 RW 01 Dusun Krajan', -5.9841, 107.2401, 'https://goo.gl/maps/1'),
('01', '02', 'Bp. Tarwan', '628121111002', 'Dusun Krajan', 'RT 02 RW 01 Dusun Krajan', -5.9842, 107.2402, 'https://goo.gl/maps/2'),
('01', '03', 'Bp. Somad', '628121111003', 'Dusun Krajan', 'RT 03 RW 01 Dusun Krajan', -5.9843, 107.2403, 'https://goo.gl/maps/3'),
('02', '01', 'Bp. Nanang', '628121111004', 'Dusun Kalijaya', 'RT 01 RW 02 Dusun Kalijaya', -5.9851, 107.2411, 'https://goo.gl/maps/4'),
('02', '02', 'Bp. Rosid', '628121111005', 'Dusun Kalijaya', 'RT 02 RW 02 Dusun Kalijaya', -5.9852, 107.2412, 'https://goo.gl/maps/5'),
('02', '03', 'Bp. Safei', '628121111006', 'Dusun Kalijaya', 'RT 03 RW 02 Dusun Kalijaya', -5.9853, 107.2413, 'https://goo.gl/maps/6'),
('03', '01', 'Bp. Carim', '628121111007', 'Dusun Gempol Tengah', 'RT 01 RW 03 Dusun Gempol Tengah', -5.9861, 107.2421, 'https://goo.gl/maps/7'),
('03', '02', 'Bp. Warya', '628121111008', 'Dusun Gempol Tengah', 'RT 02 RW 03 Dusun Gempol Tengah', -5.9862, 107.2422, 'https://goo.gl/maps/8'),
('03', '03', 'Bp. Darsum', '628121111009', 'Dusun Gempol Tengah', 'RT 03 RW 03 Dusun Gempol Tengah', -5.9863, 107.2423, 'https://goo.gl/maps/9'),
('04', '01', 'Bp. Subur', '628121111010', 'Dusun Gempol Utara', 'RT 01 RW 04 Dusun Gempol Utara', -5.9871, 107.2431, 'https://goo.gl/maps/10'),
('04', '02', 'Bp. Rasim', '628121111011', 'Dusun Gempol Utara', 'RT 02 RW 04 Dusun Gempol Utara', -5.9872, 107.2432, 'https://goo.gl/maps/11'),
('04', '03', 'Bp. Sarkim', '628121111012', 'Dusun Gempol Utara', 'RT 03 RW 04 Dusun Gempol Utara', -5.9873, 107.2433, 'https://goo.gl/maps/12');

-- Seed Complaints (8 Items)
insert into public.complaints (ticket_number, reporter_name, whatsapp, address, rt_rw, category, title, description, incident_location, status) values
('PGD-20260621-1001', 'Sutisna', '628571234567', 'Dusun Krajan', 'RT 01/RW 01', 'Infrastruktur', 'Jalan Rusak Depan Balai Desa', 'Jalan berlubang besar yang membahayakan pengendara motor saat hujan.', 'Jalan Raya Krajan KM 2', 'Dikirim'),
('PGD-20260621-1002', 'Riana', '628571234568', 'Dusun Kalijaya', 'RT 02/RW 02', 'Layanan Publik', 'Antrean KTP Lambat', 'Pelayanan pencetakan KTP elektronik memakan waktu sangat lama.', 'Kantor Pelayanan Desa', 'Diproses'),
('PGD-20260621-1003', 'Mulyadi', '628571234569', 'Dusun Gempol Tengah', 'RT 03/RW 03', 'Lingkungan', 'Sampah Menumpuk di Saluran Irigasi', 'Saluran air tersumbat karena tumpukan sampah plastik pemukiman.', 'Saluran Irigasi Tersier Blok B', 'Ditindaklanjuti'),
('PGD-20260621-1004', 'Karsum', '628571234570', 'Dusun Krajan', 'RT 03/RW 01', 'Lainnya', 'Penerangan Jalan Mati', 'Lampu jalan PJU dekat masjid mati selama 3 hari berturut-turut.', 'Masjid Jami At-Taqwa', 'Selesai'),
('PGD-20260621-1005', 'Novi', '628571234571', 'Dusun Kalijaya', 'RT 01/RW 02', 'Kesehatan', 'Banyak Jentik Nyamuk di Saluran Air', 'Genangan air pembuangan warga dipenuhi jentik nyamuk khawatir DBD.', 'Dusun Kalijaya RT 01', 'Dikirim'),
('PGD-20260621-1006', 'Subhan', '628571234572', 'Dusun Gempol Utara', 'RT 02/RW 04', 'Keamanan', 'Pencurian Tabung Gas', 'Marak kehilangan tabung gas melon di warung kecil warga saat malam.', 'Blok Utara Pasar Kaget', 'Dikirim'),
('PGD-20260621-1007', 'Rohayati', '628571234573', 'Dusun Krajan', 'RT 02/RW 01', 'Bantuan Sosial', 'Data Penerima Bansos Tidak Sesuai', 'Warga mampu mendapat bansos sementara janda tua miskin terlewat.', 'RT 02 RW 01 Dusun Krajan', 'Diproses'),
('PGD-20260621-1008', 'Yudi', '628571234574', 'Dusun Gempol Tengah', 'RT 01/RW 03', 'Infrastruktur', 'Jembatan Penghubung Dusun Retak', 'Tiang penyangga jembatan kecil penyeberangan retak parah.', 'Kali Gelatik Blok Tengah', 'Selesai');

-- Seed UMKM (10 Items)
insert into public.umkm (business_name, owner_name, category, description, price, location, whatsapp, image_url, is_active) values
('Krupuk Udang Rebon Asli', 'Ibu Minah', 'Kuliner', 'Kerupuk renyah tradisional dari udang rebon pesisir Karawang.', 'Rp 15.000 / bungkus', 'Krajan RT 01', '628123456781', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400', true),
('Kerajinan Bambu Gempol', 'Bp. Udin', 'Kerajinan', 'Peralatan rumah tangga dari bambu seperti bakul nasi, tampah, dan anyaman dekoratif.', 'Mulai Rp 20.000', 'Gempol Tengah RT 02', '628123456782', 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=400', true),
('Madu Asli Hutan Bakau', 'Bp. Joko', 'Pertanian', 'Madu murni yang dipanen dari budidaya lebah hutan bakau pesisir.', 'Rp 80.000 / botol', 'Kalijaya RT 03', '628123456783', 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=400', true),
('Batik Corak Pesisir Karawang', 'Ibu Lilis', 'Fashion', 'Kain batik cap khas dengan motif biota laut dan mangrove khas Gempolkarya.', 'Rp 120.000 / meter', 'Krajan RT 02', '628123456784', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=400', true),
('Kopi Jahe Seduh Tradisional', 'Kang Asep', 'Kuliner', 'Bubuk kopi robusta racikan lokal dicampur jahe merah bakar pilihan.', 'Rp 25.000 / pack', 'Gempol Tengah RT 01', '628123456785', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400', true),
('Ikan Asin Jambal Roti', 'Ibu Ani', 'Kuliner', 'Olahan ikan asin segar kering higienis tanpa bahan pengawet kimia.', 'Rp 65.000 / kg', 'Krajan RT 03', '628123456786', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=400', true),
('Dodol Kelapa Muda', 'Ibu Neneng', 'Kuliner', 'Dodol legit manis alami berbahan dasar santan murni dan kelapa parut muda.', 'Rp 30.000 / kotak', 'Kalijaya RT 01', '628123456787', 'https://images.unsplash.com/photo-1581798459219-318e76aecc7b?auto=format&fit=crop&q=80&w=400', true),
('Minyak Kelapa Virgin (VCO)', 'Bp. Tarto', 'Kesehatan', 'Minyak kelapa murni berkualitas tinggi diproses dingin tanpa pemanasan.', 'Rp 45.000 / botol', 'Gempol Utara RT 02', '628123456788', 'https://images.unsplash.com/photo-1610970881699-44a5587caa90?auto=format&fit=crop&q=80&w=400', true),
('Keripik Pisang Aneka Rasa', 'Teh Rina', 'Kuliner', 'Keripik pisang renyah manis dan asin dari kebun lokal Karawang.', 'Rp 12.000 / bungkus', 'Krajan RT 01', '628123456789', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&q=80&w=400', true),
('Pupuk Organik Cair BUMDes', 'Kelompok Tani Binaan', 'Pertanian', 'Pupuk penyubur tanaman hasil fermentasi limbah jerami dan kotoran ternak.', 'Rp 20.000 / liter', 'Gempol Tengah RT 03', '628123456790', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=400', true);

-- Seed Gallery (12 Items)
insert into public.gallery (title, category, image_url, event_date) values
('Peringatan Hari Kemerdekaan RI ke-80', 'Kegiatan', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600', '2025-08-17'),
('Musrenbangdes Penetapan RKPDes 2026', 'Pemerintahan', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600', '2026-01-20'),
('Kerja Bakti Massal Normalisasi Saluran Air', 'Sosial', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=600', '2026-02-15'),
('Penyaluran BLT-Dana Desa Tahap Pertama', 'Pemerintahan', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600', '2026-03-05'),
('Bimbingan Teknis Aplikasi Keuangan Desa', 'Pemerintahan', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600', '2026-03-22'),
('Pemeriksaan Tumbuh Kembang Anak Posyandu', 'Kegiatan', 'https://images.unsplash.com/photo-1502741224143-90386d7c8c82?auto=format&fit=crop&q=80&w=600', '2026-04-10'),
('Festival Kuliner Tradisional Gempolkarya', 'Kegiatan', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600', '2026-04-28'),
('Pemberian Makanan Tambahan Cegah Stunting', 'Kegiatan', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600', '2026-05-02'),
('Pelatihan Siaga Bencana Kebakaran Hutan', 'Sosial', 'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?auto=format&fit=crop&q=80&w=600', '2026-05-18'),
('Senam Kebugaran Lansia Bersama Puskesmas', 'Kegiatan', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600', '2026-06-01'),
('Penghargaan Desa Hijau Karawang Lestari', 'Pemerintahan', 'https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?auto=format&fit=crop&q=80&w=600', '2026-06-10'),
('Pentas Seni Tradisional Sunda Jaipongan', 'Kegiatan', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=600', '2026-06-15');

-- Seed Potentials (6 Items)
insert into public.potentials (title, category, description, image_url, summary_value) values
('Pertanian Padi Produktif', 'Pertanian', 'Lahan persawahan dataran rendah seluas 310 Ha menghasilkan padi unggulan varietas pandanwangi.', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800', '310 Hektar'),
('Kelompok Budidaya Mangrove', 'Lingkungan', 'Konservasi wilayah pesisir dan hutan mangrove yang berfungsi sebagai benteng abrasi laut Jawa.', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800', '5 Hektar'),
('Sentra UMKM Keripik Tempe', 'Komersial', 'Lebih dari 40 warga menggerakkan industri rumahan pembuatan aneka keripik tempe rasa.', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=800', '40+ Pengusaha'),
('Budidaya Bandeng Salinitas Tinggi', 'Perikanan', 'Tambak ikan bandeng segar organik berlokasi di Dusun Kalijaya yang melayani pasar lokal.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800', '12 Tambak'),
('BUMDes Gempol Mandiri', 'Ekonomi', 'Koperasi desa penyedia sarana produksi pertanian dan unit sewa alsintan untuk petani.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800', 'Aset 150 Juta'),
('Wisata Kuliner Kebun Bambu', 'Pariwisata', 'Restorasi kawasan hutan bambu milik warga menjadi pusat kuliner sunda dan anyaman seni.', 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&q=80&w=800', '1.200 Warga/bln');

-- Seed Demographics
insert into public.demographics (type, label, value, sort_order) values
-- Gender
('gender', 'Laki-laki', 2431, 1),
('gender', 'Perempuan', 2395, 2),

-- Education
('education', 'Tidak Sekolah', 266, 1),
('education', 'SD/Sederajat', 1520, 2),
('education', 'SMP/Sederajat', 1240, 3),
('education', 'SMA/Sederajat', 1410, 4),
('education', 'Diploma (D1-D4)', 180, 5),
('education', 'Sarjana (S1-S3)', 210, 6),

-- Jobs
('job', 'Petani / Kebun', 1650, 1),
('job', 'Karyawan Swasta', 1220, 2),
('job', 'Wiraswasta / UMKM', 880, 3),
('job', 'PNS / TNI / POLRI', 120, 4),
('job', 'Pelajar / Mahasiswa', 730, 5),
('job', 'Belum / Tidak Bekerja', 226, 6),

-- Age Groups
('age_group', '0 - 5 tahun', 390, 1),
('age_group', '6 - 12 tahun', 530, 2),
('age_group', '13 - 18 tahun', 480, 3),
('age_group', '19 - 35 tahun', 1450, 4),
('age_group', '36 - 50 tahun', 1190, 5),
('age_group', '51 - 65 tahun', 610, 6),
('age_group', '66+ tahun', 176, 7),

-- Religion
('religion', 'Islam', 4792, 1),
('religion', 'Kristen Protestan', 24, 2),
('religion', 'Katolik', 10, 3),
('religion', 'Hindu', 0, 4),
('religion', 'Buddha', 0, 5),
('religion', 'Konghucu', 0, 6);
