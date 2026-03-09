export type TextBlock = {
  type: "text";
  text: string;
};

export type ThinkingBlock = {
  type: "thinking";
  text: string;
};

export type Block = TextBlock | ThinkingBlock;

export type Source = {
  id: number;
  citation: string;
  url: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: Block[];
  sources?: Source[];
  status?: "streaming" | "done";
};
