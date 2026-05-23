import pg from 'pg';

const passwords = [
  '10131427@Fmfm',
  '10131427@fmfm',
  '10131427@FMFM',
  '10131427fmfm',
  '10131427Fmfm',
  '10131427',
  'Fmfm'
];

async function run() {
  for (const pwd of passwords) {
    console.log(`Testing password: "${pwd}" on port 6543...`);
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
      await client.end();
      return;
    } catch (err) {
      console.log(`Failed for "${pwd}":`, err.message);
    }
  }
  console.log('All passwords failed.');
}

run();
