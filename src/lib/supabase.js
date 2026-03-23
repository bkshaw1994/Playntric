import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Only create a real client when credentials are filled in
export const supabase =
  url && key && !url.includes("YOUR_") && !key.includes("YOUR_")
    ? createClient(url, key)
    : null;

export const isSupabaseReady = !!supabase;

/*
 * ─── Supabase Setup Instructions ───────────────────────────────────────────
 *
 * 1. Go to https://supabase.com → create a free project
 *
 * 2. In the SQL editor, run:
 *
 *    CREATE TABLE scores (
 *      id          BIGSERIAL PRIMARY KEY,
 *      game        TEXT NOT NULL,
 *      player_name TEXT NOT NULL,
 *      score       INTEGER NOT NULL DEFAULT 0,
 *      metadata    JSONB DEFAULT '{}',
 *      created_at  TIMESTAMPTZ DEFAULT NOW()
 *    );
 *
 *    ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
 *    CREATE POLICY "Public read"   ON scores FOR SELECT USING (true);
 *    CREATE POLICY "Public insert" ON scores FOR INSERT WITH CHECK (true);
 *
 * 3. Copy your Project URL and publishable/anon key from:
 *    Project Settings → API
 *
 * 4. Replace the placeholder values in .env:
 *    VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
 *    VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_xxx
 *
 * 5. Restart the dev server (`npm run dev`)
 * ─────────────────────────────────────────────────────────────────────────
 */
