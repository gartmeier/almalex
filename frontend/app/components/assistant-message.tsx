import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import type { Message, ThinkingBlock } from "~/types/messages";

function ThinkingBlockView({
  block,
  isStreaming,
}: {
  block: ThinkingBlock;
  isStreaming: boolean;
}) {
  let [isExpanded, setIsExpanded] = useState(false);
  let { t } = useTranslation();

  if (isStreaming) {
    return (
      <p className="text-muted-foreground my-4 animate-pulse text-sm italic">
        {t("chat.thinking")}
      </p>
    );
  }

  return (
    <div className="my-4">
      <button
        className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronRight
          size={14}
          className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
        />
        <span>{t("chat.thinkingDone")}</span>
      </button>

      {isExpanded && (
        <div className="text-muted-foreground mt-2 max-h-[300px] overflow-y-auto pl-5 text-sm italic whitespace-pre-wrap">
          {block.text}
        </div>
      )}
    </div>
  );
}

export function AssistantMessageBlock({
  message,
  isStreaming,
}: {
  message: Message;
  isStreaming: boolean;
}) {
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
          return (
            <ThinkingBlockView
              key={index}
              block={block}
              isStreaming={isStreaming && message.content.length === 1}
            />
          );
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
