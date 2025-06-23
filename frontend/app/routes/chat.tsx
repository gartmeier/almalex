import { useEffect } from "react";
import { useParams, useRouteLoaderData } from "react-router";
import { ChatProvider } from "~/components/chat/context";
import { Messages } from "~/components/chat/messages";
import { Panel } from "~/components/chat/panel";
import { RateLimitAlert } from "~/components/chat/rate-limit-alert";
import { Sidebar } from "~/components/chat/sidebar";
import { useChat } from "~/lib/hooks/use-chats";
import { nanoid } from "~/lib/nanoid";

export default function Chat() {
  let { token } = useRouteLoaderData("root");

  let { chatId } = useParams();
  let { data: chat, isLoading } = useChat(chatId);

  const chatData = chat || {
    id: chatId || nanoid(),
    title: "New chat",
    messages: [],
  };

  useEffect(() => {
    if (!isLoading) {
      if (chat) {
        document.title = `${chat.title} - Alma Lex`;
      } else {
        document.title = "New chat - Alma Lex";
      }
    }
  }, [chat, isLoading]);

  return (
    <ChatProvider chat={chatData} token={token}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Messages />
          <RateLimitAlert />
          <Panel />
        </div>
      </div>
    </ChatProvider>
  );
}
