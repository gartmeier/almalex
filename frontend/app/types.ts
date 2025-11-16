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
  arguments: any;
};

export type ToolResultEvent = {
  type: "tool_result";
  id: string;
  result: any;
};

export type ServerSentEvent =
  | ReasoningDeltaEvent
  | TextDeltaEvent
  | ToolCallEvent
  | ToolResultEvent;
