export type TextContentBlock = {
  type: "text";
  text: string;
};

export type ReasoningContentBlock = {
  type: "reasoning";
  text: string;
};

export type ToolCallContentBlock = {
  type: "tool_call";
  id: string;
  name: string;
  arguments: Record<string, unknown>;
};

export type ToolResultContentBlock = {
  type: "tool_result";
  tool_call_id: string;
  result: unknown;
};

export type MessageDetail = {
  id: string;
  role: string;
  content: string;
  content_blocks: Array<
    | TextContentBlock
    | ReasoningContentBlock
    | ToolCallContentBlock
    | ToolResultContentBlock
  >;
};
