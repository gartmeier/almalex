export type ReasoningDeltaEvent = {
  type: "reasoning";
  delta: string;
};

export type TextDeltaEvent = {
  type: "text";
  delta: string;
};

export type ToolCallEvent = {
  type: "tool_call";
  id: string;
  name: string;
  arguments: Record<string, unknown>;
};

export type ToolResultEvent = {
  type: "tool_result";
  tool_call_id: string;
  result: unknown;
};

export type ServerSentEvent =
  | ReasoningDeltaEvent
  | TextDeltaEvent
  | ToolCallEvent
  | ToolResultEvent;
