import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type ScrollToBottomContextType = {
  isAtBottom: boolean;
  onViewportEnter: () => void;
  onViewportLeave: () => void;
};

let ScrollToBottomContext = createContext<ScrollToBottomContextType | null>(
  null,
);

export function ScrollToBottomProvider({ children }: { children: ReactNode }) {
  let [isAtBottom, setIsAtBottom] = useState(true);

  function onViewportEnter() {
    console.log("enter");
    setIsAtBottom(true);
  }

  function onViewportLeave() {
    console.log("leave");
    setIsAtBottom(false);
  }

  return (
    <ScrollToBottomContext.Provider
      value={{
        isAtBottom,
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

