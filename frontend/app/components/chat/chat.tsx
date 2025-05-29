import { ChatProvider } from "~/components/chat/context";
import { Messages } from "~/components/chat/messages";
import { Panel } from "~/components/chat/panel";
import type { ChatDetail } from "~/lib/api";

export function Chat({ chat, token }: { chat: ChatDetail; token: string }) {
  return (
    <ChatProvider chat={chat} token={token}>
      <Messages />
      <Panel />
    </ChatProvider>
  );
}
