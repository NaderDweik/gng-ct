/*
 * POST /api/chat in `npm run dev` only (the ".dev.ts" ending is a page extension only the dev
 * server uses, next.config.ts). In production the same handler runs as a Cloudflare Pages
 * Function (functions/api/chat.ts). Key: ANTHROPIC_API_KEY in .env.local.
 */
import { handleChat } from "../../../../chatbot-server/handler";

export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleChat(request, { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY, CHAT_MODEL: process.env.CHAT_MODEL });
}
