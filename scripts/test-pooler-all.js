import pg from 'pg';

const configs = [
  {
    name: 'Direct host, port 5432, ssl',
    host: 'db.gcozhjuljappdlvjweuy.supabase.co',
    port: 5432,
    user: 'postgres',
    password: '10131427@Fmfm',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Direct host, port 6543, ssl',
    host: 'db.gcozhjuljappdlvjweuy.supabase.co',
    port: 6543,
    user: 'postgres',
    password: '10131427@Fmfm',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Direct host, port 6543, pooler user, ssl',
    host: 'db.gcozhjuljappdlvjweuy.supabase.co',
    port: 6543,
    user: 'postgres.gcozhjuljappdlvjweuy',
    password: '10131427@Fmfm',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Pooler host, port 6543, pooler user, ssl',
    host: 'aws-0-sa-east-1.pooler.supabase.com',
    port: 6543,
    user: 'postgres.gcozhjuljappdlvjweuy',
    password: '10131427@Fmfm',
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  }
];

async function run() {
  for (const cfg of configs) {
    console.log(`--- Testing: ${cfg.name} ---`);
    const client = new pg.Client(cfg);
    try {
      await client.connect();
      console.log(`SUCCESS! Connected with ${cfg.name}`);
      const res = await client.query('SELECT NOW()');
      console.log('Result:', res.rows[0]);
      await client.end();
      return;
    } catch (err) {
      console.log(`Failed:`, err.message);
    }
  }
  console.log('All configs failed.');
}

run();
