# Nova AI

A ready-to-deploy AI chat website built with `Next.js` for `Vercel`.

## Included

- modern chat interface
- server API route at `/api/chat`
- OpenAI integration through the `Responses API`
- simple setup with environment variables

## Local run

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from the example:

```bash
copy .env.example .env.local
```

3. Add your API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5
```

4. Start the app:

```bash
npm run dev
```

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repository into Vercel.
3. Add these environment variables:
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
4. Click `Deploy`.

## Important

This project sends real requests to the model through your API key. Without a key, the UI will load but the assistant will not reply.

## Stack

- `Next.js`
- `React`
- `OpenAI JavaScript SDK`
