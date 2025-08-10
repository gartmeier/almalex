export function parseServerSentEvents(rawEvents: string) {
  let parsedEvents: { name: string; data: string }[] = [];

  for (let rawEvent of rawEvents.split("\n\n")) {
    if (rawEvent) {
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

      if (!name || !data) {
        console.error("Invalid server-sent event", rawEvent);
        continue;
      }

      parsedEvents.push({ name, data });
    }
  }
  return parsedEvents;
}
