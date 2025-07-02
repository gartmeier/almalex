import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { SidebarHistoryGroup } from "~/components/sidebar-history-group";
import { deleteChat, listChats, type ChatListItem } from "~/lib/api";

export function SidebarHistory({ activeChatId }: { activeChatId: string }) {
  let { data = [] } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      let { data } = await listChats();
      return data || [];
    },
  });

  let queryClient = useQueryClient();

  let deleteMutation = useMutation({
    mutationFn: async (chatId: string) => {
      await deleteChat({ path: { chat_id: chatId } });
    },
    onMutate: async (chatId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      // Snapshot the previous value
      let previousChats = queryClient.getQueryData<any[]>(["chats"]);

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

  function handleDelete(chat: ChatListItem) {
    deleteMutation.mutate(chat.id);
  }

  let groupedChats = groupChatsByDate(data);

  return (
    <>
      <SidebarHistoryGroup
        label="Today"
        chats={groupedChats.today}
        activeChatId={activeChatId}
        onDelete={handleDelete}
      />
      <SidebarHistoryGroup
        label="Yesterday"
        chats={groupedChats.yesterday}
        activeChatId={activeChatId}
        onDelete={handleDelete}
      />
      <SidebarHistoryGroup
        label="Last Week"
        chats={groupedChats.lastWeek}
        activeChatId={activeChatId}
        onDelete={handleDelete}
      />
      <SidebarHistoryGroup
        label="Last Month"
        chats={groupedChats.lastMonth}
        activeChatId={activeChatId}
        onDelete={handleDelete}
      />
      <SidebarHistoryGroup
        label="Older"
        chats={groupedChats.older}
        activeChatId={activeChatId}
        onDelete={handleDelete}
      />
    </>
  );
}

type GroupedChats = {
  today: ChatListItem[];
  yesterday: ChatListItem[];
  lastWeek: ChatListItem[];
  lastMonth: ChatListItem[];
  older: ChatListItem[];
};

function groupChatsByDate(chats: ChatListItem[]): GroupedChats {
  let now = new Date();
  let oneWeekAgo = subWeeks(now, 1);
  let oneMonthAgo = subMonths(now, 1);

  return chats.reduce(
    (groups, chat) => {
      let chatDate = new Date(chat.created_at);

      if (isToday(chatDate)) {
        groups.today.push(chat);
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat);
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat);
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat);
      } else {
        groups.older.push(chat);
      }

      return groups;
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats,
  );
}
