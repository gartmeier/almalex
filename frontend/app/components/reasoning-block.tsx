import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ReasoningContentBlock } from "~/lib/api";

type ReasoningBlockProps = {
  block: ReasoningContentBlock;
  index: number;
};

export function ReasoningBlock({ block, index }: ReasoningBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      key={index}
      className="font-ui bg-muted/50 hover:bg-muted/70 my-4 flex min-h-[2.625rem] flex-col rounded-lg border border-dashed leading-normal tracking-tight shadow-sm transition-all duration-400 ease-out"
    >
      <button
        className="group/row text-muted-foreground hover:text-foreground flex h-[2.625rem] flex-row items-center justify-between gap-4 rounded-lg px-3 py-2 cursor-pointer transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex min-w-0 flex-row items-center gap-2">
          <div className="text-muted-foreground flex h-5 w-5 items-center justify-center">
            <span className="text-xs">💭</span>
          </div>
          <div className="font-base text-muted-foreground relative bottom-[0.5px] flex-grow overflow-hidden text-left leading-tight overflow-ellipsis whitespace-nowrap">
            Thinking...
          </div>
        </div>
        <div className="flex min-w-0 shrink-0 flex-row items-center gap-1.5">
          <div
            className={`ease-snappy-out text-muted-foreground relative bottom-[0.5px] flex transform items-center justify-center transition-transform duration-400 ${isExpanded ? "-rotate-180" : "rotate-0"}`}
            style={{ width: "16px", height: "16px" }}
          >
            <ChevronDown size={16} />
          </div>
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
            <div className="px-3 pb-3 pt-0">
              <pre className="text-muted-foreground whitespace-pre-wrap break-words text-sm font-mono">
                {block.text}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

