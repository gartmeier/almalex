import { useQuery } from "@tanstack/react-query";
import { readChat } from "~/lib/api";

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

  return {
    messages: chat?.messages || [],
  };
}
