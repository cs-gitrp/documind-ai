[documind-ai-README.md](https://github.com/user-attachments/files/29173523/documind-ai-README.md)
# DocuMind AI — Frontend

The frontend for **DocuMind AI**, a Retrieval-Augmented Generation (RAG) platform that turns your documents into a searchable, conversational knowledge base. This repo is the Next.js client — upload, chat, history, and settings UI — that talks to the [DocuMind AI backend](https://github.com/cs-gitrp/documind-backend).

**Live demo:** [documind-ai-ashy-ten.vercel.app](https://documind-ai-ashy-ten.vercel.app)
**Backend repo:** [github.com/cs-gitrp/documind-backend](https://github.com/cs-gitrp/documind-backend)


---

## What it does

- Upload PDF, DOCX, or TXT files and track indexing status (processing / indexed / failed)
- Chat with one or more documents — streamed responses, multi-turn sessions, and exact source citations (document, page number, match score) for every answer
- Click any cited source to preview the exact retrieved passage, so answers can be verified instead of trusted blindly
- Tune retrieval behavior directly from the UI: chunk size, chunk overlap, response temperature, and response mode (concise / detailed / bullet-point)
- Manage documents: rename, download, delete, inspect metadata (pages, chunks, size, status)
- Browse conversation history and storage usage from the dashboard
- Global search across documents and conversations

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A running instance of the [DocuMind AI backend](https://github.com/cs-gitrp/documind-backend) (locally or deployed)

### Installation

```bash
git clone https://github.com/cs-gitrp/documind-ai.git
cd documind-ai
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Point this to wherever your backend is running — locally on port 8000 by default, or your deployed Render URL in production.

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

## Project Structure

```
documind-ai/
├── app/                # Next.js App Router pages (Dashboard, Chat, History, Settings)
├── components/          # Reusable UI components (shadcn/ui based)
├── lib/
│   └── api.ts          # API client — all backend communication lives here
├── public/
└── ...
```

## How it connects to the backend

All API calls are centralized in `lib/api.ts`. Each browser is assigned an anonymous client identifier (stored in `localStorage`) and sent as an `X-Client-Id` header on relevant requests, so documents and chat history stay private to that browser without requiring a login.

## Notes

- This is a personal/academic project built to understand the full lifecycle of a production-style RAG application — from ingestion and retrieval to deployment.
- Free-tier hosting (Vercel + Render) means the backend may cold-start on first request after inactivity — a short delay on the very first message is expected behavior, not a bug.

## License

This project is for educational and portfolio purposes.

## Author

**Chandan Singh**
[LinkedIn](https://www.linkedin.com/in/chandan-singh-a23563304/) · [GitHub](https://github.com/cs-gitrp)
