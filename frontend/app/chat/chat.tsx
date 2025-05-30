import { data, redirect } from "react-router";
import { ChatProvider } from "~/chat/context";
import { Messages } from "~/chat/messages";
import { Panel } from "~/chat/panel";
import { Sidebar } from "~/chat/sidebar";
import { type ChatDetail, listChats, readChat } from "~/lib/api";
import { client } from "~/lib/api/client.gen";
import { nanoid } from "~/lib/utils/nanoid";
import { ensureServerToken, tokenCookie } from "~/server/auth.server";
import type { Route } from "./+types/chat";

export async function loader({ request, params }: Route.LoaderArgs) {
  let token = await ensureServerToken(request);

  client.setConfig({
    baseUrl: "http://localhost:8000/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  let chat: ChatDetail;

  if (params.chatId) {
    let { data: fetchedChat, response } = await readChat({
      path: { chat_id: params.chatId },
    });

    if (!response.ok) {
      throw redirect("/");
    }

    chat = fetchedChat!;
  } else {
    chat = {
      id: nanoid(),
      title: null,
      messages: [],
    };
  }

  let chatHistory = listChats().then(({ data }) => data || []);

  return data(
    { token, chat, chatHistory },
    { headers: { "Set-Cookie": await tokenCookie.serialize(token) } },
  );
}

export function meta({ data: { chat } }: Route.MetaArgs) {
  return [
    { title: chat.title ? `${chat.title} | Alma Lex` : "Alma Lex" },
    { name: "description", content: "Welcome to Alma Lex!" },
  ];
}

export default function Chat({ loaderData }: Route.ComponentProps) {
  let { chat, token } = loaderData;

  return (
    <ChatProvider chat={chat} token={token}>
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
