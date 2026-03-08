import { createContext, useContext, useMemo } from "react";
import type { Chat } from "~/lib/chat-storage";
import { deleteChat, loadChat, saveChat } from "~/lib/chat-storage";

type ChatStorageContextType = {
  saveChat: (chat: Chat) => void;
  loadChat: (chatId: string) => Chat | null;
  deleteChat: (chatId: string) => void;
};

const ChatStorageContext = createContext<ChatStorageContextType | null>(null);

export function ChatStorageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  let value = useMemo<ChatStorageContextType>(
    () => ({
      saveChat,
      loadChat,
      deleteChat,
    }),
    [],
  );

  return (
    <ChatStorageContext.Provider value={value}>
      {children}
    </ChatStorageContext.Provider>
  );
}

export function useChatStorage() {
  let context = useContext(ChatStorageContext);
  if (!context) {
    throw new Error("useChatStorage must be used within a ChatStorageProvider");
  }
  return context;
}
