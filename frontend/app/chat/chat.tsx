import { useEffect } from "react";
import { data, useParams } from "react-router";
import { ChatProvider } from "~/chat/context";
import { Messages } from "~/chat/messages";
import { Panel } from "~/chat/panel";
import { Sidebar } from "~/chat/sidebar";
import { useChat } from "~/lib/hooks/use-chats";
import { nanoid } from "~/lib/utils/nanoid";
import { ensureServerToken, tokenCookie } from "~/server/auth.server";
import type { Route } from "./+types/chat";

export async function loader({ request }: Route.LoaderArgs) {
  let token = await ensureServerToken(request);

  return data(
    { token },
    { headers: { "Set-Cookie": await tokenCookie.serialize(token) } },
  );
}

export default function Chat({ loaderData }: Route.ComponentProps) {
  let { token } = loaderData;
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
          <Panel />
        </div>
      </div>
    </ChatProvider>
  );
}
