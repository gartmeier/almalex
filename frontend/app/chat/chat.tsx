import { ChatProvider } from "~/chat/context";
import { Messages } from "~/chat/messages";
import { Panel } from "~/chat/panel";
import type { ChatResponse } from "~/client";
import { Sidebar } from "~/layout/sidebar";

export function Chat({ chat, token }: { chat: ChatResponse; token: string }) {
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
