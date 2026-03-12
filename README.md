# Twitter Scraper

A personal tool that automatically fetches tweets based on keywords, filters them with AI, and generates ready-to-use replies. Built with Next.js, Supabase, and deployed on Vercel with automated cron jobs.

## How It Works

1. **Define Keywords** — Add search keywords (e.g. "solana presale", "memecoin scam") through the UI
2. **Set AI Prompt** — Write a shared filtering prompt that describes what tweets you care about and how replies should sound
3. **Auto-Fetch** — A cron job runs every 12 hours, combining all active keywords into one Twitter search query
4. **AI Filters & Replies** — Fetched tweets are sent to an LLM which filters for relevance and generates a reply for each matching tweet
5. **Browse Results** — View curated tweets in a Twitter/X-inspired UI, paginated by 12-hour windows, with one-click copy for AI-generated replies

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Twitter Data**: [twitterapi.io](https://twitterapi.io) Advanced Search API
- **AI**: OpenRouter (default model: Gemini 2.0 Flash)
- **Deployment**: Vercel with cron jobs

## Database Schema

| Table | Purpose |
|-------|---------|
| `keywords` | Search keywords with active/inactive toggle |
| `filter_prompt` | Single shared AI filtering prompt |
| `raw_tweets` | All fetched tweets (before filtering) |
| `selected_tweets` | AI-filtered tweets with generated replies |

## Setup

### 1. Clone and install

```bash
git clone git@github.com:LovishB/twitter-scraper.git
cd twitter-scraper
npm install
```

### 2. Create Supabase tables

Run these SQL statements in your Supabase SQL editor:

```sql
create table keywords (
  id uuid default gen_random_uuid() primary key,
  keyword text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table filter_prompt (
  id uuid default gen_random_uuid() primary key,
  filtering_prompt text not null default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table raw_tweets (
  id uuid default gen_random_uuid() primary key,
  tweet_id text unique not null,
  keyword_id uuid references keywords(id),
  text text,
  url text,
  lang text,
  is_reply boolean,
  like_count int default 0,
  retweet_count int default 0,
  reply_count int default 0,
  quote_count int default 0,
  view_count int default 0,
  bookmark_count int default 0,
  author_id text,
  author_username text,
  author_name text,
  author_profile_picture text,
  author_is_blue_verified boolean,
  author_followers int,
  author_description text,
  created_at_twitter timestamptz,
  fetched_at timestamptz default now(),
  created_at timestamptz default now()
);

create table selected_tweets (
  id uuid default gen_random_uuid() primary key,
  raw_tweet_id uuid references raw_tweets(id),
  tweet_id text,
  text text,
  url text,
  author_username text,
  author_name text,
  author_profile_picture text,
  author_is_blue_verified boolean,
  author_followers int,
  like_count int default 0,
  retweet_count int default 0,
  view_count int default 0,
  ai_response text,
  relevance_score float,
  keyword text,
  created_at timestamptz default now()
);
```

### 3. Environment variables

Create a `.env.local` file:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
TWITTER_API_KEY=your-twitterapi-io-key
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=google/gemini-2.0-flash-001
CRON_SECRET=any-random-secret-string
```

### 4. Run locally

```bash
npm run dev
```

- **Latest Tweets**: `http://localhost:3000`
- **Keywords**: `http://localhost:3000/keywords`
- **Trigger cron manually**: `curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron`

## Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add all environment variables in project settings
4. Deploy — the cron job is auto-registered from `vercel.json` to run every 12 hours

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/keywords` | GET, POST, PUT, DELETE | Keywords CRUD |
| `/api/filter-prompt` | GET, PUT | Shared filtering prompt |
| `/api/tweets` | GET | Paginated selected tweets (12-hour windows) |
| `/api/cron` | GET | Fetch tweets, AI filter, and store results |
