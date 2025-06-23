import { isToday, isYesterday, subMonths, subWeeks } from "date-fns";
import { SidebarHistoryGroup } from "~/components/sidebar-history-group";
import { SidebarGroup } from "~/components/ui/sidebar";
import type { ChatListItem } from "~/lib/api";
import { useChats } from "~/lib/hooks/use-chats";

export function SidebarHistory() {
  let { data: chats } = useChats();
  let groupedChats = groupChatsByDate(chats);

  return (
    <SidebarGroup>
      <SidebarHistoryGroup label="Today" chats={groupedChats.today} />
      <SidebarHistoryGroup label="Yesterday" chats={groupedChats.yesterday} />
      <SidebarHistoryGroup label="Last Week" chats={groupedChats.lastWeek} />
      <SidebarHistoryGroup label="Last Month" chats={groupedChats.lastMonth} />
      <SidebarHistoryGroup label="Older" chats={groupedChats.older} />
    </SidebarGroup>
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
