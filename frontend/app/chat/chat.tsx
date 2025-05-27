import { ChatProvider } from "~/chat/context";
import { Messages } from "~/chat/messages";
import { Panel } from "~/chat/panel";
import type { ChatResponse } from "~/client";
import { Header } from "~/layout/header";

export function Chat({ chat, token }: { chat: ChatResponse; token: string }) {
  return (
    <ChatProvider chat={chat} token={token}>
      <div className="flex h-screen flex-col">
        <Header />
        <Messages />
        <Panel />
      </div>
    </ChatProvider>
  );
}
