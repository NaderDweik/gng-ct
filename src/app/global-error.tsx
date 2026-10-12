"use client";

import NextError from "next/error";
import { useEffect } from "react";
import { trackError } from "@/lib/analytics";

/** Last-resort error screen (replaces the root layout); the error goes to PostHog. */
export default function GlobalError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => trackError(error), [error]);

  return (
    <html lang="en">
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
