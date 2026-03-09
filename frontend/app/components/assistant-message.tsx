import { Brain, ChevronDown } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import type { Message, ThinkingBlock } from "~/types/messages";

function ThinkingBlockView({ block }: { block: ThinkingBlock }) {
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

export function AssistantMessageBlock({ message }: { message: Message }) {
  return (
    <div className="py-5">
      {message.content.map((block, index) => {
        if (block.type === "text") {
          return (
            <div
              key={index}
              className="prose prose-neutral dark:prose-invert inline-block max-w-none"
            >
              <Markdown>{block.text}</Markdown>
            </div>
          );
        }

        if (block.type === "thinking") {
          return <ThinkingBlockView key={index} block={block} />;
        }

        return null;
      })}
      {message.sources && message.sources.length > 0 && (
        <div className="my-2">
          <p className="text-muted-foreground text-xs font-medium">Sources</p>
          <ul className="text-muted-foreground text-xs">
            {message.sources.map((s) => (
              <li key={s.id}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {s.citation}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
