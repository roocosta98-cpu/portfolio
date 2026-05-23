import pg from 'pg';

async function run() {
  const configs = [
    {
      host: 'aws-0-sa-east-1.pooler.supabase.com',
      port: 5432,
      user: 'postgres.gcozhjuljappdlvjweuy',
      password: '10131427@Fmfm',
      database: 'postgres'
    },
    {
      host: 'aws-0-sa-east-1.pooler.supabase.com',
      port: 6543,
      user: 'postgres.gcozhjuljappdlvjweuy',
      password: '10131427@Fmfm',
      database: 'postgres'
    }
  ];

  for (const cfg of configs) {
    console.log(`Connecting to ${cfg.host}:${cfg.port} as ${cfg.user}...`);
    const client = new pg.Client({
      user: cfg.user,
      host: cfg.host,
      database: cfg.database,
      password: cfg.password,
      port: cfg.port,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`SUCCESS! Connected to ${cfg.host}:${cfg.port}`);
      const res = await client.query('SELECT NOW()');
      console.log('Result:', res.rows[0]);
      await client.end();
      return;
    } catch (err) {
      console.log(`Failed:`, err.message);
    }
  }
}

run();
