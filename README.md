# BRD Transformer

Transform template-driven business requirement documents (BRDs) and product requirement documents (PRDs) into audience-friendly formats.

## Features

- **Input**: Upload PDF or Word (.docx), or paste text
- **Transformations** (select any combination):
  - **TL;DR** – Condensed executive summary with core essence and key highlights
  - **Podcast / audiobook style** – Professional speaker tone, ideal for narration
  - **Human-readable** – Remove AI jargon, plain English
  - **Bullet points** – Convert tables to scannable bullets
  - **Remove AI indicators** – Strip AI-sounding phrases and templated language

- **Output formats**:
  - **Text** (`.txt`)
  - **PDF** (`.pdf`)
  - **MP3** – Audiobook-style audio via ElevenLabs

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` (copy from `.env.example`):
   ```env
   OPENAI_API_KEY=sk-...       # Required for AI transformation
   ELEVENLABS_API_KEY=...      # Required for MP3 output
   ```

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## API Keys

- **OpenAI**: [platform.openai.com](https://platform.openai.com) – used for GPT-4–based rewriting
- **ElevenLabs**: [elevenlabs.io](https://elevenlabs.io) – used for text-to-speech (MP3). Get an API key from the dashboard.

## Tech Stack

- **Next.js 14** (App Router)
- **Document extraction**: `unpdf` (PDF), `mammoth` (Word)
- **AI transformation**: OpenAI GPT-4
- **Text-to-speech**: ElevenLabs
- **PDF generation**: jsPDF
