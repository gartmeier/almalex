export type TextDeltaEvent = {
  type: "text_delta";
  delta: string;
};

export type ThinkingDeltaEvent = {
  type: "thinking_delta";
  delta: string;
};

export type Source = {
  id: string;
  reference: string;
  url: string;
};

export type SourcesEvent = { type: "sources"; sources: Source[] };

export type ServerSentEvent =
  | TextDeltaEvent
  | ThinkingDeltaEvent
  | SourcesEvent;
