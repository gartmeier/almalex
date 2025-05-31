import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteChat, listChats } from "~/lib/api";

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await listChats();
      return data || [];
    },
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