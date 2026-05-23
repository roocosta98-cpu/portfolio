import pg from 'pg';

async function run() {
  const client = new pg.Client({
    user: 'postgres',
    host: 'db.gcozhjuljappdlvjweuy.supabase.co',
    database: 'postgres',
    password: '10131427@Fmfm',
    port: 5432,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database with explicit parameters...');
    await client.connect();
    console.log('Connected. Running migrations...');

    // 1. site_settings
    console.log('Migrating site_settings...');
    await client.query(`
      create table if not exists public.site_settings (
        id text primary key default 'global',
        created_at timestamptz default now() not null,
        logo_url text,
        favicon_url text,
        site_title text not null default 'Rodrigo Tagashira | Product Design Lead & Developer',
        contact_email text not null default 'roocosta98@gmail.com',
        email_subject text not null default 'nova mensagem de site'
      );
    `);

    await client.query(`alter table public.site_settings enable row level security;`);
    await client.query(`drop policy if exists "Leitura pública livre para site_settings" on public.site_settings;`);
    await client.query(`create policy "Leitura pública livre para site_settings" on public.site_settings for select using (true);`);
    await client.query(`drop policy if exists "Modificação restrita ao Admin para site_settings" on public.site_settings;`);
    await client.query(`create policy "Modificação restrita ao Admin para site_settings" on public.site_settings for all using (auth.role() = 'authenticated');`);

    await client.query(`
      insert into public.site_settings (id, site_title, contact_email, email_subject)
      values ('global', 'Rodrigo Tagashira | Product Design Lead | Software Developer & Analyst', 'roocosta98@gmail.com', 'nova mensagem de site')
      on conflict (id) do nothing;
    `);

    // 2. skill_categories
    console.log('Migrating skill_categories...');
    await client.query(`
      create table if not exists public.skill_categories (
        id uuid default gen_random_uuid() primary key,
        created_at timestamptz default now() not null,
        label text not null,
        icon text not null,
        color text not null,
        skills text[] default '{}'::text[] not null
      );
    `);

    await client.query(`alter table public.skill_categories enable row level security;`);
    await client.query(`drop policy if exists "Leitura pública livre para skill_categories" on public.skill_categories;`);
    await client.query(`create policy "Leitura pública livre para skill_categories" on public.skill_categories for select using (true);`);
    await client.query(`drop policy if exists "Modificação restrita ao Admin para skill_categories" on public.skill_categories;`);
    await client.query(`create policy "Modificação restrita ao Admin para skill_categories" on public.skill_categories for all using (auth.role() = 'authenticated');`);

    // Add initial categories if empty
    const { count } = (await client.query('select count(*) from public.skill_categories')).rows[0];
    if (parseInt(count) === 0) {
      console.log('Seeding initial skill_categories...');
      await client.query(`
        insert into public.skill_categories (label, icon, color, skills) values
        ('Artificial Intelligence', 'Brain', 'from-emerald-500 to-teal-600', array['Prompt Engineering', 'Integração de LLMs (OpenAI, Anthropic, Gemini)', 'AI-Driven Development', 'IA Generativa para UI/UX', 'Automação Inteligente de Processos']),
        ('Product & UX/UI Design', 'Palette', 'from-pink-500 to-rose-600', array['Liderança de Times de Produto', 'UX Research', 'Testes de Usabilidade', 'Wireframing', 'Prototipagem de Alta Fidelidade', 'Design Systems']),
        ('Desenvolvimento de Software', 'Code2', 'from-cyan-500 to-blue-600', array['React', 'Vite', 'Node.js', 'Flutter', 'JavaScript', 'TypeScript', 'HTML / CSS', 'MySQL']),
        ('Ferramentas & Plataformas', 'Wrench', 'from-violet-500 to-purple-600', array['Figma', 'Adobe XD', 'Sketch', 'Cursor', 'v0', 'GitHub Copilot']);
      `);
    }

    // 3. Add cover_url text column to portfolio_items and built_systems
    console.log('Updating portfolio_items and built_systems...');
    await client.query(`alter table public.portfolio_items add column if not exists cover_url text;`);
    await client.query(`alter table public.built_systems add column if not exists cover_url text;`);

    console.log('All migrations completed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
