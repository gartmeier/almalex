import { ChevronDown } from "lucide-react";
import { useScrollToBottom } from "~/contexts/scroll-to-bottom";
import { Button } from "~/components/ui/button";

export function ScrollToBottomButton() {
  let { isAtBottom } = useScrollToBottom();

  if (isAtBottom) {
    return null;
  }

  return (
    <div className="mb-2 flex justify-center">
      <Button
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
