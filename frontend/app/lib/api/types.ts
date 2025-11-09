// Manual type extensions for streaming events
// The base types are auto-generated in types.gen.ts

import type {
  MessageDetail as BaseMessageDetail,
  SearchContentBlock,
  TextContentBlock,
} from "./types.gen";

// New content block types
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
  id: string;
  result: unknown;
};

// Extended content block union
export type ContentBlock =
  | TextContentBlock
  | ReasoningContentBlock
  | ToolCallContentBlock
  | ToolResultContentBlock
  | SearchContentBlock;

// Extended MessageDetail with new content block types
export type MessageDetail = Omit<BaseMessageDetail, "content_blocks"> & {
  content_blocks: Array<ContentBlock>;
};

// Re-export all other types from generated file
export * from "./types.gen";

