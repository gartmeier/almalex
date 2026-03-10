export type TextBlock = {
  type: "text";
  text: string;
};

export type ThinkingBlockData = {
  type: "thinking";
  text: string;
};

export type Block = TextBlock | ThinkingBlockData;

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
  status?: "searching" | "thinking" | "generating" | "done";
};
