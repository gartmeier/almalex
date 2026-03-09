import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Badge } from "~/components/ui/badge";
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
      <p className="text-muted-foreground mb-2.5 animate-pulse text-sm italic">
        {t("chat.thinking")}
      </p>
    );
  }

  return (
    <div className="mb-5">
      <button
        className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-sm transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{t("chat.thinkingDone")}</span>
        <ChevronRight
          size={14}
          className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
        />
      </button>

      {isExpanded && (
        <div className="prose prose-neutral dark:prose-invert prose-sm text-muted-foreground mt-2 max-w-none italic">
          <Markdown remarkPlugins={[remarkGfm]}>{block.text}</Markdown>
        </div>
      )}
    </div>
  );
}

export function AssistantMessageBlock({ message }: { message: Message }) {
  let isStreaming = message.status === "streaming";

  return (
    <div className="py-5">
      {message.content.map((block, index) => {
        if (block.type === "text") {
          return (
            <div
              key={index}
              className="prose prose-neutral dark:prose-invert inline-block max-w-none"
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ href, children, ...props }) => {
                    if (href?.match(/^#\d+$/)) {
                      let sourceId = parseInt(href.slice(1));
                      let source = message.sources?.find(
                        (result) => result.id === sourceId,
                      );
                      if (source) {
                        return (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          >
                            {children}
                          </a>
                        );
                      }
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
      {!isStreaming && message.sources && message.sources.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {message.sources.map((s) => (
            <Badge key={s.id} variant="secondary" asChild>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                {s.citation}
              </a>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
