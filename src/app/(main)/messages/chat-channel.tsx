import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Channel,
  ChannelHeader,
  ChannelHeaderProps,
  MessageInput,
  MessageList,
  Window,
} from "stream-chat-react";

type ChatChannelProps = {
  open: boolean;
  openSidebar: () => void;
};

export function ChatChannel({ open, openSidebar }: ChatChannelProps) {
  return (
    <div className={cn("w-full md:block", open ? "hidden" : null)}>
      <Channel>
        <Window>
          <ChatChannelHeader openSidebar={openSidebar} />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </div>
  );
}

type ChatChannelHeaderProps = {
  openSidebar: () => void;
} & ChannelHeaderProps;

function ChatChannelHeader({ openSidebar, ...props }: ChatChannelHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-full p-2 md:hidden">
        <Button size={"icon"} variant={"ghost"} onClick={openSidebar}>
          <Menu className="size-5" />
        </Button>
      </div>
      <ChannelHeader {...props} />
    </div>
  );
}
