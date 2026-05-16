import { neon } from '@neondatabase/serverless';

// sql tagged-template client — server-only, never import in client components
const sql = neon(process.env.DATABASE_URL!);

export default sql;

/*
 * Supabase / Neon DB schema migration (run once):
 *
 * create table container_tetris_scores (
 *   id uuid default gen_random_uuid() primary key,
 *   player_name text not null,
 *   score integer not null,
 *   lines_cleared integer not null,
 *   level integer not null,
 *   created_at timestamptz default now()
 * );
 * create index on container_tetris_scores (score desc);
 *
 * RLS (if using Supabase):
 *   alter table container_tetris_scores enable row level security;
 *   create policy "allow insert for all" on container_tetris_scores for insert with check (true);
 *   create policy "allow select for all" on container_tetris_scores for select using (true);
 */
