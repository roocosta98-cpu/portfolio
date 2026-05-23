import pg from 'pg';

async function main() {
  const client = new pg.Client({
    host: 'db.gcozhjuljappdlvjweuy.supabase.co',
    port: 5432,
    user: 'postgres',
    password: '10131427@Fmfm',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected!');

    console.log('Adding order_index to portfolio_items...');
    await client.query('ALTER TABLE public.portfolio_items ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;');
    
    console.log('Adding order_index to built_systems...');
    await client.query('ALTER TABLE public.built_systems ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;');
    
    console.log('Success! Both tables updated.');
  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

main();
