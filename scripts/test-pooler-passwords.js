import pg from 'pg';

const passwords = [
  '10131427@Fmfm',
  '10131427@fmfm',
  '10131427@FMFM',
  '10131427fmfm',
  '10131427Fmfm',
  '10131427',
  '10131427@Fmfm@db.gcozhjuljappdlvjweuy.supabase.co',
];

async function run() {
  for (const pwd of passwords) {
    console.log(`Testing password: "${pwd}" on db.gcozhjuljappdlvjweuy.supabase.co:6543`);
    const client = new pg.Client({
      user: 'postgres',
      host: 'db.gcozhjuljappdlvjweuy.supabase.co',
      database: 'postgres',
      password: pwd,
      port: 6543,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`SUCCESS! Password is: "${pwd}"`);
      const res = await client.query('SELECT NOW()');
      console.log('Result:', res.rows[0]);
      await client.end();
      return;
    } catch (err) {
      console.log(`Failed for "${pwd}":`, err.message);
    }
  }
}

run();
