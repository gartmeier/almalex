import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteChat, listChats, readChat } from "~/lib/api";

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await listChats();
      return data || [];
    },
    initialData: [],
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

export function useDeleteChatMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: string) => {
      await deleteChat({ path: { chat_id: chatId } });
    },
    onMutate: async (chatId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      // Snapshot the previous value
      const previousChats = queryClient.getQueryData<any[]>(["chats"]);

      // Optimistically update to the new value
      queryClient.setQueryData<any[]>(["chats"], (oldData) =>
        oldData ? oldData.filter((chat) => chat.id !== chatId) : [],
      );

      // Return a context object with the snapshotted value
      return { previousChats };
    },
    onError: (err, chatId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["chats"], context?.previousChats);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
}
