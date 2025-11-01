"use client";

import { Avatar } from "@/app/(main)/-components/avatar";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/contexts/session-provider";
import { useDebounce } from "@/hooks/use-debounce";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserResponse } from "stream-chat";
import { useChatContext } from "stream-chat-react";

type NewChatDialogProps = {
  onOpenChange: (open: boolean) => void;
  onChatCreated: () => void;
};

export function NewChatDialog({
  onChatCreated,
  onOpenChange,
}: NewChatDialogProps) {
  const { client, setActiveChannel } = useChatContext();

  const { user: loggedInUser } = useSession();

  const [searchInput, setSearchInput] = useState<string>("");

  const searchInputDebounced = useDebounce(searchInput);
  const [selectedUsers, setSelectedUsers] = useState<UserResponse[]>([]);

  const { data, isFetching, isPending, isLoading, isError, isSuccess } =
    useQuery({
      queryKey: ["stream-chat", searchInputDebounced],
      queryFn: async () =>
        client.queryUsers(
          {
            id: { $ne: loggedInUser.id },
            role: { $ne: "admin" },
            ...(searchInputDebounced
              ? {
                  $or: [
                    { name: { $autocomplete: searchInputDebounced } },
                    { username: { $autocomplete: searchInputDebounced } },
                  ],
                }
              : {}),
          },
          [{ name: 1 }, { username: 1 }],
          { limit: 20, presence: true },
        ),
    });

  const { mutate, isPending: isMutationPending } = useMutation({
    mutationFn: async () => {
      const channel = client.channel("messaging", {
        members: [loggedInUser.id, ...selectedUsers.map((su) => su.id)],
        name:
          selectedUsers.length > 1
            ? loggedInUser.displayName +
              ", " +
              selectedUsers.map((su) => su.name).join(", ")
            : undefined,
      });

      await channel.create();

      return channel;
    },

    onSuccess: (channel) => {
      setActiveChannel(channel);
      onChatCreated();
    },
    onError: (error) => {
      console.error("Error occurred while creating new chat", error);
      toast.error("Error starting chat. Please try again.");
    },
  });

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-card p-0"
        aria-describedby="Create New Group Chat"
      >
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only hidden">
          Create new group chat
        </DialogDescription>
        <div>
          <div className="group relative">
            <SearchIcon className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-5 size-5 -translate-y-1/2 transform" />
            <input
              type="text"
              name="search-chat-users"
              id="search-chat-users"
              placeholder="Search users..."
              className="bg-accent h-12 w-full ps-14 pe-4 focus:outline-none"
              autoComplete="off"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {selectedUsers.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2 p-2">
              {selectedUsers.map((selectedUser) => (
                <SelectedUserTag
                  key={selectedUser.id}
                  user={selectedUser}
                  onRemove={() => {
                    setSelectedUsers((prev) =>
                      prev.filter((pu) => pu.id !== selectedUser.id),
                    );
                  }}
                />
              ))}
            </div>
          ) : null}
          <hr />
          <div className="h-96 overflow-y-auto">
            {isSuccess && data.users.length > 0 ? (
              data.users.map((user) => (
                <UserResult
                  key={user.id}
                  user={user}
                  selected={selectedUsers.some((su) => su.id === user.id)}
                  onClick={() => {
                    setSelectedUsers((prev) =>
                      prev.some((pu) => pu.id === user.id)
                        ? prev.filter((pu) => pu.id !== user.id)
                        : [...prev, user],
                    );
                  }}
                />
              ))
            ) : isFetching || isPending || isLoading ? (
              <Loader2 className="animate-spin p-4 text-center" />
            ) : isError ? (
              <p className="text-destructive p-4 text-center">
                An error occurred while loading users.
              </p>
            ) : (
              <p className="text-muted-foreground p-4 text-center">
                No users found. Try a different name
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="flex justify-end gap-3 px-6 pb-6">
          <LoadingButton
            disabled={!selectedUsers.length}
            loading={isMutationPending}
            onClick={() => mutate()}
          >
            Start Chat
          </LoadingButton>
          <DialogClose asChild>
            <Button variant={"destructive"}>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type UsrResultProps = {
  user: UserResponse;
  selected: boolean;
  onClick: () => void;
};

function UserResult({ user, selected, onClick }: UsrResultProps) {
  return (
    <button
      onClick={onClick}
      className="hover:bg-muted/50 flex w-full items-center justify-between px-4 py-2.5 transition-colors"
    >
      <div className="flex items-center gap-2">
        <Avatar
          avatarUrl={user.image ?? null}
          altText={user.name ?? "User Avatar"}
        />
        <div className="flex flex-col text-start">
          <p className="font-bold">{user.name}</p>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      {selected ? <Check className="text-primary size-5" /> : null}
    </button>
  );
}

type SelectedUserTagProps = {
  user: UserResponse;
  onRemove: () => void;
};

function SelectedUserTag({ user, onRemove }: SelectedUserTagProps) {
  return (
    <button
      onClick={onRemove}
      className="hover:bg-muted/50 flex items-center gap-2 rounded-full border p-1"
    >
      <Avatar
        avatarUrl={user.image ?? null}
        altText={user.name ?? "User avatar"}
        size={24}
      />
      <p className="text-sm font-bold">{user.name}</p>
      <X className="text-muted-foreground mx-2 size-5" />
    </button>
  );
}
