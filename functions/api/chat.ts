/*
 * Cloudflare Pages Function: POST /api/chat (Layan's AI replies). The only server code on
 * the site; every page is still a static file. Logic: chatbot-server/handler.ts.
 * Secret: ANTHROPIC_API_KEY (Cloudflare dashboard → Pages project → Settings → Variables and
 * Secrets, or `npx wrangler pages secret put ANTHROPIC_API_KEY`). Optional: CHAT_MODEL.
 */
import { handleChat, type ChatEnv } from "../../chatbot-server/handler";

export const onRequestPost = ({ request, env }: { request: Request; env: ChatEnv }) => handleChat(request, env);
