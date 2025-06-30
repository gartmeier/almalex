import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { readChat, type MessageResponse } from "~/lib/api";

export function useChat(chatId: string | undefined) {
  let { data: chat } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      let { data, error } = await readChat({
        path: { chat_id: chatId! },
      });
      if (error) {
        throw new Error(`Failed to fetch chat ${chatId}`);
      }
      return data!;
    },
    enabled: !!chatId,
    staleTime: 30 * 1000, // 30 seconds
  });

  let [localMessages, setLocalMessages] = useState<MessageResponse[]>([]);

  useEffect(() => {
    if (chat?.messages) {
      setLocalMessages(chat.messages);
    }
  }, [chat?.messages]);

  function addMessage(message: MessageResponse) {
    setLocalMessages((prev) => {
      return [...prev, message];
    });
  }

  function updateMessage(id: string, updatedMessage: MessageResponse) {
    setLocalMessages((prev) =>
      prev.map((msg) => (msg.id === id ? updatedMessage : msg)),
    );
  }

  return {
    messages: localMessages,
    addMessage,
    updateMessage,
  };
}
