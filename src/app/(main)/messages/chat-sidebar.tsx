"use client";

import { NewChatDialog } from "@/app/(main)/messages/new-chat-dialog";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/session-provider";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { MailPlus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  ChannelList,
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  useChatContext,
} from "stream-chat-react";

type ChatSidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function ChatSidebar({ open, onClose }: ChatSidebarProps) {
  const { user } = useSession();

  const queryClient = useQueryClient();
  const { channel } = useChatContext();

  useEffect(() => {
    if (channel?.id) {
      queryClient.invalidateQueries({
        queryKey: ["unread-messages-count"],
      });
    }
  }, [channel?.id, queryClient]);

  const ChatChannelPreview = useCallback(
    (props: ChannelPreviewUIComponentProps) => (
      <ChannelPreviewMessenger
        {...props}
        onSelect={() => {
          props.setActiveChannel?.(props.channel, props.watchers);
          onClose();
        }}
      />
    ),
    [onClose],
  );

  return (
    <div
      className={cn(
        "size-full flex-col border-e md:flex md:w-72",
        open ? "flex" : "hidden",
      )}
    >
      <ChatMenuHeader onClose={onClose} />
      <ChannelList
        filters={{
          type: "messaging",
          members: { $in: [user.id] },
        }}
        showChannelSearch
        options={{ state: true, presence: true, limit: 8 }}
        sort={{ last_message_at: -1 }}
        additionalChannelSearchProps={{
          searchForChannels: true,
          searchQueryParams: {
            channelFilters: {
              filters: {
                type: "messaging",
                members: { $in: [user.id] },
              },
            },
          },
        }}
        Preview={ChatChannelPreview}
      />
    </div>
  );
}

type ChatMenuHeaderProps = {
  onClose: () => void;
};

function ChatMenuHeader({ onClose }: ChatMenuHeaderProps) {
  const [showNewChatDialog, setShowNewChatDialog] = useState<boolean>(false);

  return (
    <>
      <div className="flex items-center gap-3 p-2">
        <div className="h-full md:hidden">
          <Button size={"icon"} variant={"ghost"} onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
        <h1 className="me-auto text-xl font-bold md:ms-2">Messages</h1>
        <Button
          size={"icon"}
          variant={"ghost"}
          title="Start New Chat"
          onClick={() => setShowNewChatDialog(true)}
        >
          <MailPlus className="size-5" />
        </Button>
      </div>
      {showNewChatDialog ? (
        <NewChatDialog
          onChatCreated={() => {
            setShowNewChatDialog(false);
            onClose();
          }}
          onOpenChange={setShowNewChatDialog}
        />
      ) : null}
    </>
  );
}
