import * as Sentry from "@sentry/react";
import { ChevronDown, FileText, Loader2, Search } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import type {
  ContentBlock,
  MessageDetail,
  ReasoningContentBlock,
  SearchContentBlock,
  SearchResult,
  TextContentBlock,
  ToolCallContentBlock,
  ToolResultContentBlock,
} from "~/lib/api";
import { ReasoningBlock } from "./reasoning-block";
import { ToolCallBlock } from "./tool-call-block";
import { ToolResultBlock } from "./tool-result-block";

type AssistantMessageProps = {
  message: MessageDetail;
};

export function SearchBlock({
  block,
  index,
}: {
  block: SearchContentBlock;
  index: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLoading = block.status === "in_progress";

  return (
    <div
      key={index}
      className="font-ui bg-muted hover:bg-muted/80 my-4 flex min-h-[2.625rem] flex-col rounded-lg border leading-normal tracking-tight shadow-sm transition-all duration-400 ease-out"
    >
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
              : block.query}
          </div>
        </div>
        <div className="flex min-w-0 shrink-0 flex-row items-center gap-1.5">
          {!isLoading && (
            <>
              <p className="text-muted-foreground font-small relative bottom-[0.5px] shrink-0 pl-1 leading-tight whitespace-nowrap">
                {block.results.length}{" "}
                {block.results.length === 1 ? "result" : "results"}
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
              {block.results.map((result) => (
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

function renderContentBlock(
  block: ContentBlock,
  index: number,
  searchResults: SearchResult[],
) {
  switch (block.type) {
    case "text":
      return (
        <div
          key={index}
          className="prose prose-neutral dark:prose-invert inline-block max-w-none"
        >
          <Markdown
            components={{
              a: ({ href, children, ...props }) => {
                // Check if this is a citation link (e.g., #1234)
                if (href?.match(/^#\d+$/)) {
                  let documentId = parseInt(href.slice(1)); // Remove the # prefix and convert to number
                  // Find the document in search results
                  let document = searchResults.find(
                    (result) => result.id === documentId,
                  );
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
                  // Document not found - AI hallucinated the citation
                  Sentry.captureMessage("AI cited non-existent document", {
                    level: "warning",
                    extra: {
                      documentId,
                      citationText: children?.toString(),
                      availableDocumentIds: searchResults.map((r) => r.id),
                    },
                  });
                  // Fallback if document not found in search results
                  return (
                    <a href={href} {...props}>
                      {children}
                    </a>
                  );
                }
                // Regular external links
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

    case "reasoning":
      return (
        <ReasoningBlock key={index} block={block as ReasoningContentBlock} index={index} />
      );

    case "tool_call":
      return (
        <ToolCallBlock key={index} block={block as ToolCallContentBlock} index={index} />
      );

    case "tool_result":
      return (
        <ToolResultBlock
          key={index}
          block={block as ToolResultContentBlock}
          index={index}
          searchResults={searchResults}
        />
      );

    case "search":
      return <SearchBlock key={index} block={block} index={index} />;

    default:
      return null;
  }
}

export function AssistantMessage({ message }: AssistantMessageProps) {
  // Collect all search results from search blocks and tool results
  let searchResults: SearchResult[] = [];
  for (let block of message.content_blocks || []) {
    if (block.type === "search") {
      searchResults.push(...block.results);
    } else if (block.type === "tool_result") {
      // Extract search results from tool results if they match the format
      if (
        Array.isArray(block.result) &&
        block.result.length > 0 &&
        block.result[0] &&
        typeof block.result[0] === "object" &&
        "id" in block.result[0] &&
        "title" in block.result[0] &&
        "url" in block.result[0]
      ) {
        searchResults.push(...(block.result as SearchResult[]));
      }
    }
  }

  return (
    <div className="py-5">
      {message.content_blocks?.map((block, index) =>
        renderContentBlock(block, index, searchResults),
      )}
    </div>
  );
}
