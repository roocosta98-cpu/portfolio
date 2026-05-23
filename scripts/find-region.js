import pg from 'pg';

const regions = [
  'sa-east-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'ap-southeast-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-south-1',
  'ca-central-1'
];

async function run() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    console.log(`Checking region "${region}" via host "${host}"...`);
    const client = new pg.Client({
      user: 'postgres.gcozhjuljappdlvjweuy',
      host: host,
      database: 'postgres',
      password: 'test', // dummy password, we just want to see if the tenant is found
      port: 6543,
      ssl: { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log(`FOUND TENANT in region "${region}"! (Authentication succeeded unexpectedly?)`);
      await client.end();
      return;
    } catch (err) {
      if (err.message.includes('not found') || err.message.includes('ENOTFOUND')) {
        // Tenant not found in this region
        console.log(`  Region "${region}": tenant not found.`);
      } else {
        // Tenant was found, but password or other error occurred!
        console.log(`  >>> FOUND TENANT in region "${region}"! Error was:`, err.message);
        client.end().catch(() => {});
        return;
      }
    }
  }
  console.log('Finished checking all regions.');
}

run();
