# Puzzle App (Next.js + Supabase)

## Setup
1. Create a Supabase project. Copy Project URL and anon key.
2. In Supabase SQL editor, run `db/schema.sql` to create tables and RLS.
3. In Vercel (or `.env.local`), set env vars:
   - NEXT_PUBLIC_SUPABASE_URL=... 
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   - NEXT_PUBLIC_ADMIN_EMAIL=evi@example.com

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Deploy
Push to GitHub and import into Vercel. Set the same env vars there.

## Assets
Place your files in `/public` with these names:
- Capture.JPG
- metadata.jpeg
- convert.ing-now________SPECTOGRAM.wav
