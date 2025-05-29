import { ChatProvider } from "~/components/chat/context";
import { Messages } from "~/components/chat/messages";
import { Panel } from "~/components/chat/panel";
import type { ChatDetail } from "~/lib/api";
import { Sidebar } from "~/components/layout/sidebar";

export function Chat({ chat, token }: { chat: ChatDetail; token: string }) {
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
