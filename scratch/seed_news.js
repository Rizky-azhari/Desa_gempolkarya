const { Client } = require('pg');

async function main() {
  const connectionString = "postgresql://postgres:" + encodeURIComponent("#Kkndesagempolkarya") + "@db.xjxubpncjcpvwmpvchoh.supabase.co:5432/postgres";
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log("Connected.");

    const count = await client.query("SELECT COUNT(*) FROM public.news;");
    console.log("News count:", count.rows[0].count);

    if (parseInt(count.rows[0].count) > 0) {
      const sample = await client.query("SELECT id, title, slug, status FROM public.news LIMIT 5;");
      console.log("Sample news:", JSON.stringify(sample.rows, null, 2));
      return;
    }

    console.log("No news found, seeding...");

    const newsList = [
      {
        title: 'Gotong Royong Pembersihan Saluran Irigasi RT 03 RW 01',
        slug: 'gotong-royong-saluran-irigasi-rt03-rw01',
        category: 'Kegiatan',
        excerpt: 'Warga RT 03 RW 01 bersama perangkat desa menggelar kerja bakti pembersihan saluran irigasi yang sudah tersumbat selama beberapa pekan terakhir.',
        content: 'Kegiatan gotong royong ini berlangsung pada hari Minggu pagi dan diikuti oleh lebih dari 50 warga. Saluran irigasi yang telah tersumbat akibat sedimentasi dan sampah plastik kini telah berhasil dibersihkan sehingga aliran air kembali lancar untuk mengairi sawah warga.',
        status: 'published'
      },
      {
        title: 'Penyaluran Bantuan Pangan Non Tunai (BPNT) Tahap II Tahun 2026',
        slug: 'penyaluran-bpnt-tahap-2-2026',
        category: 'Pengumuman',
        excerpt: 'Pemerintah Desa Gempolkarya mengumumkan jadwal penyaluran Bantuan Pangan Non Tunai (BPNT) tahap kedua untuk seluruh Keluarga Penerima Manfaat (KPM) terdaftar.',
        content: 'Penyaluran akan dilaksanakan mulai tanggal 25 Juni 2026 di Balai Desa Gempolkarya. Warga penerima manfaat dimohon untuk membawa KTP dan Kartu Keluarga asli beserta fotokopi sebagai syarat pengambilan bantuan.',
        status: 'published'
      },
      {
        title: 'Pembangunan Jalan Beton RT 04 RW 02 Tahap 3 Telah Rampung',
        slug: 'pembangunan-jalan-beton-rt04-rw02-tahap3',
        category: 'Pembangunan',
        excerpt: 'Proyek pembangunan jalan beton di wilayah RT 04 RW 02 sepanjang 150 meter telah selesai dikerjakan dan siap digunakan oleh warga.',
        content: 'Pembangunan jalan beton ini merupakan bagian dari program Dana Desa tahun anggaran 2026. Jalan yang sebelumnya berupa tanah dan sering becek saat hujan kini telah diubah menjadi jalan beton berkualitas tinggi yang dapat dilalui oleh kendaraan roda empat.',
        status: 'published'
      },
      {
        title: 'Sosialisasi Program Kartu Indonesia Sehat (KIS) untuk Warga Kurang Mampu',
        slug: 'sosialisasi-program-kis-warga-kurang-mampu',
        category: 'Berita Utama',
        excerpt: 'Dinas Kesehatan Kabupaten bersama Pemerintah Desa Gempolkarya mengadakan sosialisasi Program Kartu Indonesia Sehat untuk masyarakat kurang mampu yang belum terdaftar.',
        content: 'Acara sosialisasi ini dihadiri oleh ratusan warga. Tim dari Dinas Kesehatan memberikan penjelasan mengenai cara mendaftar dan manfaat yang didapatkan dari program KIS. Warga yang belum memiliki KIS dan memenuhi kriteria dapat langsung mendaftar pada hari tersebut.',
        status: 'published'
      },
      {
        title: 'Pelatihan Pembuatan Pupuk Organik dari Limbah Rumah Tangga',
        slug: 'pelatihan-pupuk-organik-limbah-rumah-tangga',
        category: 'Kegiatan',
        excerpt: 'Kelompok Tani Desa Gempolkarya bersama Dinas Pertanian mengadakan pelatihan pembuatan pupuk organik berbahan baku limbah rumah tangga dan kotoran hewan.',
        content: 'Pelatihan ini bertujuan untuk meningkatkan kemandirian petani lokal dalam menyediakan pupuk organik berkualitas tinggi dengan biaya rendah. Para peserta diajarkan teknik pengomposan modern yang ramah lingkungan dan efisien.',
        status: 'published'
      },
    ];

    for (const news of newsList) {
      await client.query(`
        INSERT INTO public.news (title, slug, category, excerpt, content, status, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, now(), now(), now())
        ON CONFLICT (slug) DO NOTHING;
      `, [news.title, news.slug, news.category, news.excerpt, news.content, news.status]);
      console.log("✅ Inserted:", news.title);
    }

    const after = await client.query("SELECT id, title, slug, status FROM public.news ORDER BY created_at;");
    console.log("\nAll news:", JSON.stringify(after.rows, null, 2));

  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await client.end();
  }
}

main();
