import * as Sentry from "@sentry/react";
import { Brain, ChevronDown, FileText, Loader2, Search } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import type {
  MessageDetail,
  ReasoningContentBlock,
  ToolCallContentBlock,
  ToolResultContentBlock,
} from "~/lib/api";
import type { SearchResult } from "~/types";

type AssistantMessageProps = {
  message: MessageDetail;
};

type ContentBlock = MessageDetail["content_blocks"][number];

function ReasoningBlock({ block }: { block: ReasoningContentBlock }) {
  let [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="font-ui bg-muted/50 my-4 flex min-h-[2.625rem] flex-col rounded-lg border border-dashed leading-normal tracking-tight transition-all duration-400 ease-out">
      <button
        className="group/row text-muted-foreground hover:text-foreground flex h-[2.625rem] cursor-pointer flex-row items-center justify-between gap-4 rounded-lg px-3 py-2 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex min-w-0 flex-row items-center gap-2">
          <div className="text-muted-foreground flex h-5 w-5 items-center justify-center">
            <Brain size={16} />
          </div>
          <div className="font-base text-muted-foreground relative bottom-[0.5px] flex-grow overflow-hidden text-left leading-tight overflow-ellipsis whitespace-nowrap">
            Thinking
          </div>
        </div>
        <div
          className={`ease-snappy-out text-muted-foreground relative bottom-[0.5px] flex transform items-center justify-center transition-transform duration-400 ${isExpanded ? "-rotate-180" : "rotate-0"}`}
          style={{ width: "16px", height: "16px" }}
        >
          <ChevronDown size={16} />
        </div>
      </button>

      <div
        className="shrink-0 overflow-hidden"
        style={{
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? "auto" : "0px",
        }}
      >
        <div className="text-muted-foreground max-h-[300px] overflow-y-auto px-3 pb-3 text-sm whitespace-pre-wrap">
          {block.text}
        </div>
      </div>
    </div>
  );
}

function ToolUseBlock({
  toolCall,
  toolResult,
}: {
  toolCall: ToolCallContentBlock;
  toolResult?: ToolResultContentBlock;
}) {
  let [isExpanded, setIsExpanded] = useState(false);
  let isLoading = !toolResult;
  let results = Array.isArray(toolResult?.result) ? (toolResult.result as SearchResult[]) : [];
  let args = toolCall.arguments as { query?: string; reference?: string };
  let query = args.query || args.reference || "";

  return (
    <div className="font-ui bg-muted hover:bg-muted/80 my-4 flex min-h-[2.625rem] flex-col rounded-lg border leading-normal tracking-tight shadow-sm transition-all duration-400 ease-out">
      <button
        className={`group/row text-muted-foreground hover:text-muted-foreground flex h-[2.625rem] flex-row items-center justify-between gap-4 rounded-lg px-3 py-2 transition-colors duration-200 ${isLoading ? "cursor-default" : "hover:text-foreground cursor-pointer"}`}
        onClick={() => !isLoading && setIsExpanded(!isExpanded)}
        disabled={isLoading}
      >
        <div className="flex min-w-0 flex-row items-center gap-2">
          <div className="text-muted-foreground flex h-5 w-5 items-center justify-center">
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
          </div>
          <div className="font-base text-muted-foreground relative bottom-[0.5px] flex-grow overflow-hidden text-left leading-tight overflow-ellipsis whitespace-nowrap">
            {isLoading
              ? "Searching for relevant law and court decisions"
              : query}
          </div>
        </div>
        <div className="flex min-w-0 shrink-0 flex-row items-center gap-1.5">
          {!isLoading && (
            <>
              <p className="text-muted-foreground font-small relative bottom-[0.5px] shrink-0 pl-1 leading-tight whitespace-nowrap">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              <div
                className={`ease-snappy-out text-muted-foreground relative bottom-[0.5px] flex transform items-center justify-center transition-transform duration-400 ${isExpanded ? "-rotate-180" : "rotate-0"}`}
                style={{ width: "16px", height: "16px" }}
              >
                <ChevronDown size={16} />
              </div>
            </>
          )}
        </div>
      </button>

      <div
        className="shrink-0 overflow-hidden"
        style={{
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? "auto" : "0px",
        }}
      >
        <div className="min-h-0">
          <div className="h-full max-h-[238px] min-h-0 overflow-x-hidden overflow-y-auto">
            <div className="flex flex-col flex-nowrap p-2 pt-0">
              {results.map((result) => (
                <div key={result.id}>
                  <a
                    target="_blank"
                    href={result.url}
                    rel="noopener noreferrer"
                  >
                    <button className="hover:bg-muted/50 flex h-[2rem] w-full min-w-0 shrink-0 cursor-pointer flex-row items-center justify-between gap-4 rounded-md px-1 tracking-tight">
                      <div className="flex min-w-0 flex-row items-center gap-2">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                          <FileText
                            size={14}
                            className="text-muted-foreground"
                          />
                        </div>
                        <p className="text-foreground relative bottom-[1px] shrink overflow-hidden text-[0.875rem] text-ellipsis whitespace-nowrap">
                          {result.title}
                        </p>
                      </div>
                    </button>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  let blocks = message.content_blocks || [];

  // Build a map of tool_result by tool_call_id for quick lookup
  let toolResults = new Map<string, ToolResultContentBlock>();
  for (let block of blocks) {
    if (block.type === "tool_result") {
      toolResults.set(block.tool_call_id, block);
    }
  }

  // Collect all search results for citation linking
  let searchResults: SearchResult[] = [];
  for (let block of blocks) {
    if (block.type === "tool_result" && Array.isArray(block.result)) {
      searchResults.push(...(block.result as SearchResult[]));
    }
  }

  function renderBlock(block: ContentBlock, index: number) {
    if (block.type === "text") {
      return (
        <div
          key={index}
          className="prose prose-neutral dark:prose-invert inline-block max-w-none"
        >
          <Markdown
            components={{
              a: ({ href, children, ...props }) => {
                if (href?.match(/^#\d+$/)) {
                  let documentId = parseInt(href.slice(1));
                  let document = searchResults.find((r) => r.id === documentId);
                  if (document) {
                    return (
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  }
                  Sentry.captureMessage("AI cited non-existent document", {
                    level: "warning",
                    extra: {
                      documentId,
                      citationText: children?.toString(),
                      availableDocumentIds: searchResults.map((r) => r.id),
                    },
                  });
                  return (
                    <a href={href} {...props}>
                      {children}
                    </a>
                  );
                }
                return (
                  <a href={href} {...props}>
                    {children}
                  </a>
                );
              },
            }}
          >
            {block.text}
          </Markdown>
        </div>
      );
    }

    if (block.type === "tool_call") {
      let result = toolResults.get(block.id);
      return <ToolUseBlock key={index} toolCall={block} toolResult={result} />;
    }

    if (block.type === "reasoning") {
      return <ReasoningBlock key={index} block={block} />;
    }

    // Skip tool_result blocks (rendered with their tool_call)
    return null;
  }

  return (
    <div className="py-5">
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
