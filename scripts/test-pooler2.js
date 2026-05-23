import pg from 'pg';

const client = new pg.Client({
  user: 'postgres.gcozhjuljappdlvjweuy',
  host: 'db.gcozhjuljappdlvjweuy.supabase.co',
  database: 'postgres',
  password: '10131427@Fmfm',
  port: 6543,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Connecting to db.gcozhjuljappdlvjweuy.supabase.co:6543 with user postgres.gcozhjuljappdlvjweuy...');
    await client.connect();
    console.log('SUCCESS!');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection failed:', err.message);
  }
}

run();
