"use client";

import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function MarkAsRead() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch(`/api/notifications/mark-as-read`),
    onSuccess: async () => {
      queryClient.cancelQueries({ queryKey: ["unread-notification-count"] });
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError: (error) => {
      console.error("Failed to mark all notification as read", error);
    },
  });
  return (
    <Button variant={"ghost"} onClick={() => mutate()} className="text-primary">
      Mark all as read
    </Button>
  );
}
