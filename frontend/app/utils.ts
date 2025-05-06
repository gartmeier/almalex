import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  12,
);

export function parseServerSentEvents(rawEvents: string) {
  return rawEvents
    .trim()
    .split("\n\n")
    .map(parseServerSentEvent)
    .filter((a) => !!a);
}

function parseServerSentEvent(rawEvent: string) {
  let lines = rawEvent.split("\n");

  let name: string | null = null;
  let data: string | null = null;

  for (let line of lines) {
    if (line.startsWith("event: ")) {
      name = line.slice(7);
    } else if (line.startsWith("data: ")) {
      data = line.slice(6);
    }
  }

  console.log(name, data);

  if (!name || !data) {
    console.error("Invalid server-sent event", rawEvent);
    return null;
  }

  return { name, data };
}
