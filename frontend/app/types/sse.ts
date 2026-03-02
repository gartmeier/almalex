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

export type StatusEvent = {
  type: "status";
  status: string;
};

export type ArticleSource = {
  article_id: number;
  citation: string;
  article_number: string;
  act_sr_number: string;
  act_abbr: string | null;
  act_title: string | null;
};

export type DecisionSource = {
  decision_id: number;
  citation: string;
  decision_number: string;
  decision_date: string;
  html_url: string | null;
};

export type ArticlesEvent = { type: "articles"; articles: ArticleSource[] };
export type DecisionsEvent = { type: "decisions"; decisions: DecisionSource[] };

export type ServerSentEvent =
  | ReasoningDeltaEvent
  | TextDeltaEvent
  | ToolCallEvent
  | ToolResultEvent
  | StatusEvent
  | ArticlesEvent
  | DecisionsEvent;
