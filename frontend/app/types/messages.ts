export type TextContentBlock = {
  type: "text";
  text: string;
};

export type ReasoningContentBlock = {
  type: "reasoning";
  text: string;
};

export type Source = {
  id: string;
  reference: string;
  url: string;
};

export type MessageDetail = {
  id: string;
  role: string;
  content: string;
  content_blocks: Array<TextContentBlock | ReasoningContentBlock>;
  sources?: Source[];
};
