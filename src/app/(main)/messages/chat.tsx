"use client";

import { ChatChannel } from "@/app/(main)/messages/chat-channel";
import { ChatSidebar } from "@/app/(main)/messages/chat-sidebar";
import { useInitializeChatClient } from "@/app/(main)/messages/use-initialize-chat-client";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Chat as StreamChat } from "stream-chat-react";

export function Chat() {
  const { chatClient } = useInitializeChatClient();
  const { resolvedTheme } = useTheme();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  if (!chatClient) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  return (
    <section className="bg-card relative sm:h-[calc(100vh-6rem)] h-[calc(100vh-10rem)] w-full overflow-hidden rounded-2xl shadow-sm">
      <div className="h-[calc(100vh - 5.25rem)] absolute top-0 bottom-0 flex w-full">
        <StreamChat
          client={chatClient}
          theme={
            resolvedTheme === "dark"
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <ChatSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <ChatChannel
            open={sidebarOpen}
            openSidebar={() => setSidebarOpen(true)}
          />
        </StreamChat>
      </div>
    </section>
  );
}
