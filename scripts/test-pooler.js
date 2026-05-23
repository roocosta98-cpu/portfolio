import pg from 'pg';

const hosts = [
  'aws-0-sa-east-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'db.gcozhjuljappdlvjweuy.supabase.co' // pooler host can also just be the direct host if it resolves IPv4 on 6543
];

const passwords = ['10131427@Fmfm'];

async function test() {
  for (const host of hosts) {
    for (const pwd of passwords) {
      console.log(`Testing Host: "${host}" with port 6543 / 5432`);
      
      // Try port 6543 with user.project_ref
      const client = new pg.Client({
        user: host.includes('pooler') ? 'postgres.gcozhjuljappdlvjweuy' : 'postgres',
        host: host,
        database: 'postgres',
        password: pwd,
        port: 6543,
        ssl: { rejectUnauthorized: false }
      });

      try {
        console.log(`Connecting to ${host}:6543...`);
        await client.connect();
        console.log(`SUCCESS on port 6543 for host "${host}"!`);
        
        // Let's run a test query
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        await client.end();
        return;
      } catch (err) {
        console.log(`Failed for ${host}:6543 -`, err.message);
      }

      // Also try port 5432
      const client2 = new pg.Client({
        user: 'postgres',
        host: host,
        database: 'postgres',
        password: pwd,
        port: 5432,
        ssl: { rejectUnauthorized: false }
      });

      try {
        console.log(`Connecting to ${host}:5432...`);
        await client2.connect();
        console.log(`SUCCESS on port 5432 for host "${host}"!`);
        const res = await client2.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        await client2.end();
        return;
      } catch (err) {
        console.log(`Failed for ${host}:5432 -`, err.message);
      }
    }
  }
}

test();
