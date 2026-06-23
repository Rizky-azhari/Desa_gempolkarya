import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://desa-gempolkarya.vercel.app';
  
  const routes = [
    '',
    '/profil',
    '/pemerintahan',
    '/layanan',
    '/data-desa',
    '/pengaduan',
    '/berita',
    '/kontak',
    '/potensi',
    '/umkm',
    '/galeri',
    '/peta-rt-rw',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
