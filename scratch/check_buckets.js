const { Client } = require('pg');

async function main() {
  const connectionString = "postgresql://postgres:" + encodeURIComponent("#Kkndesagempolkarya") + "@db.xjxubpncjcpvwmpvchoh.supabase.co:5432/postgres";
  const client = new Client({ connectionString });
  await client.connect();

  console.log("=== Storage Buckets ===");
  const { rows: buckets } = await client.query("SELECT id, name, public FROM storage.buckets");
  console.log(buckets);

  console.log("\n=== Storage Policies ===");
  const { rows: policies } = await client.query(`
    SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check 
    FROM pg_policies 
    WHERE schemaname = 'storage'
  `);
  console.log(policies);

  await client.end();
}

main().catch(console.error);
