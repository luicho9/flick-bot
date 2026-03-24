# Flick Bot

Ever been in the mood for a movie but can't decide what to watch? Or found a film you loved and wanted something similar? Flick Bot is a WhatsApp companion that helps you search, discover, and compare movies, all without leaving the chat.

> The name "flick" comes from the early days of cinema. Low frame rates made the projected image *flicker*, so people started calling movies "flickers" and eventually just *flicks*.

Built with [Chat SDK](https://chat-sdk.vercel.app), the [Kapso Chat SDK](https://github.com/luicho9/kapso-chat-sdk) community adapter, and the [TMDB API](https://www.themoviedb.org/).

## Commands

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `/search <title>` | Search for any movie by title          |
| `/trending`       | See what's trending this week          |
| `/details <id>`   | Full details — cast, director, ratings |
| `/recommend <id>` | Get similar movie recommendations      |
| `/help`           | Show available commands                |

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

| Variable                | Where to get it                                                |
| ----------------------- | -------------------------------------------------------------- |
| `TMDB_API_ACCESS_TOKEN` | [TMDB Settings → API](https://www.themoviedb.org/settings/api) |
| `TMDB_API_KEY`          | Same page as above                                             |
| `KAPSO_API_KEY`         | [Kapso Dashboard](https://kapso.ai)                            |
| `KAPSO_PHONE_NUMBER_ID` | Kapso Dashboard → Connected numbers                            |
| `KAPSO_WEBHOOK_SECRET`  | Kapso Dashboard → Webhooks                                     |
| `REDIS_URL`             | Default: `redis://localhost:6379`. Use [Upstash](https://upstash.com) for serverless. |

### 3. Run the dev server

```bash
pnpm dev
```

### 4. Expose via ngrok

```bash
ngrok http 3000
```

### 5. Register the webhook

In your Kapso Dashboard, set the webhook URL to:

```
https://<your-ngrok-url>/webhooks/whatsapp
```

### 6. Send a message

Message your WhatsApp number and you'll get the welcome message with interactive buttons. Try `/search Inception` to get started.

## Project Structure

```
lib/
  bot.ts        Bot instance and event handler wiring
  commands.ts   Command parser and handler logic
  cards.ts      WhatsApp interactive button cards
  format.ts     Movie formatting helpers
  tmdb.ts       TMDB API client
app/
  page.tsx                    Landing page
  webhooks/whatsapp/route.ts  Kapso webhook endpoint
```
