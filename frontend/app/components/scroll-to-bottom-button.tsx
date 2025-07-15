import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useScrollToBottom } from "~/contexts/scroll-to-bottom";

export function ScrollToBottomButton() {
  let { isAtBottom, scrollToBottom } = useScrollToBottom();

  if (isAtBottom) {
    return null;
  }

  return (
    <div className="mb-2 flex justify-center">
      <Button
        onClick={() => scrollToBottom()}
        variant="secondary"
        size="icon"
        className="rounded-full shadow-lg"
        aria-label="Scroll to bottom"
      >
        <ChevronDown size={20} />
      </Button>
    </div>
  );
}
