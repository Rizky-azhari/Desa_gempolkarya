export interface NewsItem {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: 'Pengumuman' | 'Kegiatan' | 'Berita Utama' | 'Pembangunan';
  date: string;
  author: string;
  image: string;
  readTime: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  duration: string;
  cost: string;
  category: 'Administrasi' | 'Kependudukan' | 'Kesejahteraan' | 'Umum';
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  phone?: string;
  email?: string;
  nip?: string;
  category?: string;
}

export interface DemographicData {
  gender: { name: string; value: number; percentage: string }[];
  education: { level: string; count: number }[];
  job: { title: string; count: number }[];
  ageGroup: { range: string; count: number }[];
}

export interface VillageProfile {
  name: string;
  district: string;
  regency: string;
  province: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  slogan: string;
  vision: string;
  mission: string[];
  history: string;
  geographic: {
    area: string;
    borders: {
      north: string;
      south: string;
      east: string;
      west: string;
    };
    topography: string;
  };
  mapEmbedUrl: string;
  statistics: {
    population: string;
    households: string;
    rtCount: number;
    rwCount: number;
    areaSize: string;
  };
}

export interface ComplaintItem {
  id: string;
  reporterName: string;
  title: string;
  description: string;
  category: string;
  date: string;
  status: 'Belum Diproses' | 'Sedang Diproses' | 'Selesai';
  response?: string;
  responseDate?: string;
}

export interface UmkmItem {
  id: string;
  name: string;
  owner: string;
  category: string;
  description: string;
  photo: string;
  whatsapp: string;
  address: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
}

export interface RtRwItem {
  id: string;
  rt: string;
  rw: string;
  headName: string;
  population: number;
  households: number;
}

export interface PotentialItem {
  id: string;
  title: string;
  description: string;
  category: string;
  photo: string;
}
