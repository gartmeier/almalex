import type { Source } from "./messages";

export type TextDeltaEvent = {
  type: "text_delta";
  delta: string;
};

export type ThinkingDeltaEvent = {
  type: "thinking_delta";
  delta: string;
};

export type SourcesEvent = { type: "sources"; sources: Source[] };

export type ServerSentEvent =
  | TextDeltaEvent
  | ThinkingDeltaEvent
  | SourcesEvent;
