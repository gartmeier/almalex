import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { parseServerSentEvents } from "~/lib/sse";
import type { MessageResponse } from "~/lib/api";

type StreamMessageOptions = {
  chatId: string;
  token: string;
  onMessageUpdate: (id: string, message: MessageResponse) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
};

export function useStreamMessage() {
  let queryClient = useQueryClient();

  return useCallback(async (userMessage: MessageResponse, options: StreamMessageOptions) => {
    let { chatId, token, onMessageUpdate, onError, onComplete } = options;
    
    // Create assistant message placeholder
    let assistantMessage: MessageResponse = {
      id: `temp_assistant_${Date.now()}`,
      content: "",
      role: "assistant",
      created_at: new Date().toISOString(),
    };

    let controller = new AbortController();
    
    try {
      let response = await fetch(`/api/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userMessage),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      let reader = response.body!.getReader();
      let decoder = new TextDecoder();

      try {
        while (true) {
          let { done, value } = await reader.read();

          if (done) break;

          let chunk = decoder.decode(value);
          let events = parseServerSentEvents(chunk);

          for (let event of events) {
            switch (event.name) {
              case "chat_title":
                document.title = `${event.data} | Alma Lex`;
                queryClient.invalidateQueries({ queryKey: ["chats"] });
                break;
              case "message_id":
                assistantMessage.id = event.data;
                onMessageUpdate(assistantMessage.id, assistantMessage);
                queryClient.invalidateQueries({ queryKey: ["chats"] });
                break;
              case "message_delta":
                assistantMessage.content += event.data;
                onMessageUpdate(assistantMessage.id, assistantMessage);
                break;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      onComplete?.();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }

    return () => controller.abort();
  }, [queryClient]);
}