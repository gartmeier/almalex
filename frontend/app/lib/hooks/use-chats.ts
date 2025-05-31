import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteChat, listChats, readChat } from "~/lib/api";

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await listChats();
      return data || [];
    },
  });
}

export function useChat(chatId: string | undefined) {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      if (!chatId) return null;
      const { data } = await readChat({
        path: { chat_id: chatId },
      });
      return data || null;
    },
    enabled: !!chatId,
  });
}

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return {
    deleteChat: async (chatId: string) => {
      await deleteChat({ path: { chat_id: chatId } });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  };
}
