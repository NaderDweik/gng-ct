/*
 * POST /api/chat: Layan's replies, written by Claude from the site's own content
 * (chatbot-server/prompt.ts). Runs as a Cloudflare Pages Function in production
 * (functions/api/chat.ts) and as a Next route in `npm run dev` (src/app/api/chat/route.dev.ts).
 *
 * Request:  { messages: [{ role: "user" | "assistant", content: string }, ...] }  (last = user)
 * Response: a stream of server-sent events, one JSON object per `data:` line:
 *   { t: "text" }            text as it's written
 *   { book: true }           open the in-chat visit booking (components/chatbot/chat-booking.ts)
 *   { suggest: [q1, q2] }    suggested follow-up questions
 *   { done: true }           finished
 *   { error: "..." }         failed; the widget falls back to the on-device bot
 */
import Anthropic from "@anthropic-ai/sdk";
import { systemPrompt } from "./prompt";

export type ChatEnv = {
  ANTHROPIC_API_KEY?: string;
  /** Optional override; defaults to Claude Opus 5.5. */
  CHAT_MODEL?: string;
};

const MODEL = "claude-opus-5-5";
const MAX_TURNS = 16; // only the latest turns are sent
const MAX_CHARS = 1000; // per message

const tools: Anthropic.Beta.BetaTool[] = [
  {
    name: "start_booking",
    description:
      "Open the visit booking form inside the chat. Call this when the visitor wants to visit the compound, book an appointment or a tour, or accepts an offer to visit. The form asks for name, phone, day and hour itself.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
    strict: true,
    eager_input_streaming: true,
  },
  {
    name: "suggest_questions",
    description:
      "Show 2 short follow-up questions the visitor can tap to ask next. Written as the visitor would ask, in the visitor's language, answerable from the knowledge.",
    input_schema: {
      type: "object",
      properties: { questions: { type: "array", items: { type: "string" } } },
      required: ["questions"],
      additionalProperties: false,
    },
    strict: true,
    eager_input_streaming: true,
  },
];

type Turn = { role: "user" | "assistant"; content: string };

function readTurns(body: unknown): Turn[] | null {
  const list = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(list) || !list.length) return null;
  const turns: Turn[] = [];
  for (const m of list.slice(-MAX_TURNS)) {
    const role = (m as Turn)?.role;
    const content = (m as Turn)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string" || !content.trim()) return null;
    turns.push({ role, content: content.slice(0, MAX_CHARS) });
  }
  // The API wants the conversation to open with the visitor.
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns.length && turns[turns.length - 1].role === "user" ? turns : null;
}

/** Only pages of this site may call it (browsers always send Origin on a POST). */
function sameSite(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function handleChat(request: Request, env: ChatEnv): Promise<Response> {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!sameSite(request)) return new Response("Forbidden", { status: 403 });
  if (!env.ANTHROPIC_API_KEY) return new Response("Chat not configured", { status: 503 });

  let turns: Turn[] | null = null;
  try {
    turns = readTurns(await request.json());
  } catch {
    // fall through
  }
  if (!turns) return new Response("Bad request", { status: 400 });

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 45_000 });
  const encoder = new TextEncoder();

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (data: object) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      try {
        const stream = client.beta.messages.stream({
          model: env.CHAT_MODEL || MODEL,
          // Short chat replies; also caps what one request can cost on a public endpoint.
          max_tokens: 4096,
          output_config: { effort: "low" },
          // A request a safety classifier declines is retried on a suitable model server-side.
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          // Instructions + the whole site knowledge: identical on every request, so cached.
          system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral", ttl: "1h" } }],
          tools,
          messages: turns!,
        });

        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") send({ t: event.delta.text });
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          send({ error: "refusal" });
        } else {
          for (const block of final.content) {
            if (block.type !== "tool_use") continue;
            // Tool input is streamed eagerly, so check its shape before using it.
            if (block.name === "start_booking") send({ book: true });
            else if (block.name === "suggest_questions") {
              const qs = (block.input as { questions?: unknown })?.questions;
              if (Array.isArray(qs)) {
                const clean = qs.filter((q): q is string => typeof q === "string" && q.trim().length > 0 && q.length < 120).slice(0, 3);
                if (clean.length) send({ suggest: clean });
              }
            }
          }
          send({ done: true });
        }
      } catch (e) {
        if (e instanceof Anthropic.RateLimitError) send({ error: "busy" });
        else if (e instanceof Anthropic.APIError) send({ error: `api ${e.status ?? ""}`.trim() });
        else send({ error: "failed" });
        console.error("chat error", e);
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
