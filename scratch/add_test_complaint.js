const { Client } = require('pg');

async function main() {
  const connectionString = "postgresql://postgres:" + encodeURIComponent("#Kkndesagempolkarya") + "@db.xjxubpncjcpvwmpvchoh.supabase.co:5432/postgres";
  const client = new Client({ connectionString });
  await client.connect();

  console.log("Checking current complaints...");
  const { rows } = await client.query("SELECT id, ticket_number, title, photo_url FROM complaints LIMIT 10");
  console.log("Existing complaints:", rows);

  // Insert a test complaint with photo if none has one
  const hasPhoto = rows.some(r => r.photo_url);
  if (!hasPhoto) {
    console.log("No complaint has a photo. Inserting a test complaint with a photo...");
    const ticketNumber = `PGD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-9999`;
    
    await client.query(`
      INSERT INTO complaints (
        ticket_number, title, description, category, whatsapp, address, rt_rw, photo_url, is_anonymous, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      )
    `, [
      ticketNumber,
      "Test Pengaduan dengan Foto",
      "Ini adalah deskripsi laporan pengaduan uji coba yang dilengkapi dengan foto pembuktian agar dapat diverifikasi penampilannya di feed publik.",
      "Infrastruktur",
      "081234567890",
      "Dusun Krajan",
      "RT 02 / RW 01",
      "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&q=80&w=800",
      false,
      "Dikirim"
    ]);
    console.log("Inserted test complaint with ticket number:", ticketNumber);
  } else {
    console.log("There is already a complaint with a photo.");
  }

  await client.end();
}

main().catch(console.error);
