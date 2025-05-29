import { useEffect } from "react";
import { data, redirect } from "react-router";
import { ensureServerToken, tokenCookie } from "~/server/auth.server";
import { Chat } from "~/components/chat/chat";
import { type ChatDetail, readChat } from "~/lib/api";
import { client } from "~/lib/api/client.gen";
import { nanoid } from "~/lib/utils/nanoid";
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

  return data(
    { chat, token },
    { headers: { "Set-Cookie": await tokenCookie.serialize(token) } },
  );
}

export function meta({ data: { chat } }: Route.MetaArgs) {
  return [
    { title: chat.title ? `${chat.title} | Alma Lex` : "Alma Lex" },
    { name: "description", content: "Welcome to Alma Lex!" },
  ];
}

export default function Page({ loaderData }: Route.ComponentProps) {
  let { chat, token } = loaderData;

  useEffect(() => {
    client.setConfig({
      baseUrl: "/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [token]);

  return <Chat chat={chat} token={token} />;
}
