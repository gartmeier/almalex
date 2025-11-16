import * as Sentry from "@sentry/react";
import type { ServerSentEvent } from "~/types";

export function parseServerSentEvents(rawEvents: string) {
  let parsedEvents: ServerSentEvent[] = [];

  for (let rawEvent of rawEvents.split("\n\n")) {
    if (!rawEvent || !rawEvent.startsWith("data: {")) {
      continue;
    }

    // drop "data: " prefix
    rawEvent = rawEvent.slice(6);

    try {
      let event = JSON.parse(rawEvent);
      parsedEvents.push(event);
    } catch (e) {
      console.error("Invalid server-sent event", rawEvent);
      Sentry.captureException(e);
    }
  }

  return parsedEvents;
}
