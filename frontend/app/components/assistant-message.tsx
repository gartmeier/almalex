import { ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import { Badge } from "~/components/ui/badge";
import type { Message, ThinkingBlockData } from "~/types/messages";

function ThinkingBlock({ block }: { block: ThinkingBlockData }) {
  let [isExpanded, setIsExpanded] = useState(false);
  let { t } = useTranslation();

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
        <div className="prose prose-neutral dark:prose-invert prose-sm text-muted-foreground mt-2 max-w-none">
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {block.text}
          </Markdown>
        </div>
      )}
    </div>
  );
}

function Status({ message }: { message: Message }) {
  let { t } = useTranslation();

  if (message.status === "searching") {
    return (
      <div className="flex items-center gap-2">
        <Search size={14} className="text-muted-foreground animate-pulse" />
        <span className="text-muted-foreground animate-pulse text-sm">
          {t("chat.searching")}
        </span>
      </div>
    );
  }

  if (message.status === "thinking") {
    return (
      <div className="text-muted-foreground flex animate-pulse items-center gap-2 text-sm">
        {t("chat.thinking")}
      </div>
    );
  }

  return null;
}

export function AssistantMessageBlock({ message }: { message: Message }) {
  return (
    <div className="py-5">
      <Status message={message} />
      {message.content.map((block, index) => {
        if (block.type === "text") {
          return (
            <div
              key={index}
              className="prose prose-neutral dark:prose-invert inline-block max-w-none"
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
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
              {message.status === "generating" && (
                <span className="animate-pulse text-sm">▋</span>
              )}
            </div>
          );
        }

        if (
          block.type === "thinking" &&
          (message.status === "generating" || message.status === "done")
        ) {
          return <ThinkingBlock key={index} block={block} />;
        }

        return null;
      })}
      {message.status === "done" &&
        message.sources &&
        message.sources.length > 0 && (
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
