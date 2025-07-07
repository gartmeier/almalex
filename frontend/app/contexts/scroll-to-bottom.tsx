import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type ScrollToBottomContextType = {
  isAtBottom: boolean;
  endRef: React.RefObject<HTMLDivElement | null>;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  onViewportEnter: () => void;
  onViewportLeave: () => void;
};

let ScrollToBottomContext = createContext<ScrollToBottomContextType | null>(
  null,
);

export function ScrollToBottomProvider({ children }: { children: ReactNode }) {
  let [isAtBottom, setIsAtBottom] = useState(true);
  let [scrollBehavior, setScrollBehavior] = useState<false | ScrollBehavior>(
    false,
  );
  let endRef = useRef<HTMLDivElement>(null);

  function onViewportEnter() {
    setIsAtBottom(true);
  }

  function onViewportLeave() {
    setIsAtBottom(false);
  }

  function scrollToBottom(behavior: ScrollBehavior = "smooth") {
    setScrollBehavior(behavior);
  }

  useEffect(() => {
    if (scrollBehavior !== false && endRef.current) {
      endRef.current.scrollIntoView({ behavior: scrollBehavior });
      setScrollBehavior(false);
    }
  }, [scrollBehavior]);

  return (
    <ScrollToBottomContext.Provider
      value={{
        isAtBottom,
        endRef,
        scrollToBottom,
        onViewportEnter,
        onViewportLeave,
      }}
    >
      {children}
    </ScrollToBottomContext.Provider>
  );
}

export function useScrollToBottom() {
  let context = useContext(ScrollToBottomContext);
  if (!context) {
    throw new Error(
      "useScrollToBottom must be used within ScrollToBottomProvider",
    );
  }
  return context;
}
