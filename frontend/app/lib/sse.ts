import * as Sentry from "@sentry/react";
import type { ServerSentEvent } from "~/types";

export function createSSEParser() {
  let buffer = "";
  let decoder = new TextDecoder();

  return function parse(
    chunk: Uint8Array,
    done: boolean = false,
  ): ServerSentEvent[] {
    buffer += decoder.decode(chunk, { stream: !done });

    let events: ServerSentEvent[] = [];
    let parts = buffer.split("\n\n");

    // Keep the last part in buffer (may be incomplete)
    buffer = parts.pop() || "";

    for (let part of parts) {
      if (!part.startsWith("data: ")) {
        continue;
      }

      let json = part.slice(6);
      try {
        events.push(JSON.parse(json));
      } catch (e) {
        console.error("Invalid server-sent event", json);
        Sentry.captureException(e);
      }
    }

    return events;
  };
}
