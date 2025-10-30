"use client";

import { InfiniteScrollContainer } from "@/app/(main)/-components/infinite-scroll-container";
import {
  PostLoadingSkeleton,
  PostsLoadingSkeleton,
} from "@/app/(main)/-components/posts-loading-skeleton";
import kyInstance from "@/lib/ky";
import {
  NotificationCountInfo,
  NotificationData,
  NotificationsPage,
} from "@/lib/types";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { NotificationType } from "@prisma/client";
import { Heart, MessageCircle, User2 } from "lucide-react";
import { JSX } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Avatar } from "@/app/(main)/-components/avatar";

export function NotificationsFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    gcTime: Infinity,
  });

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "error") {
    return (
      <p className="text-destructive text-center">
        An error occurred while loading notifications.
      </p>
    );
  }

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];

  if (status === "success" && notifications.length === 0 && !hasNextPage) {
    return (
      <h2 className="text-muted-foreground text-center">
        You don&apos;t have any notifications yet.
      </h2>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReach={() =>
        hasNextPage && !isFetching ? fetchNextPage() : null
      }
      className="space-y-5"
    >
      {notifications.map((notification) => (
        <Notification key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage ? <PostLoadingSkeleton /> : null}
    </InfiniteScrollContainer>
  );
}

type NotificationProps = {
  notification: NotificationData;
};

function Notification({ notification }: NotificationProps) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () =>
      kyInstance
        .patch(`/api/notifications/${notification.id}/mark-as-read`)
        .json<NotificationCountInfo>(),
    onSuccess: async (data) => {
      queryClient.cancelQueries({ queryKey: ["unread-notification-count"] });
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: data.unreadCount,
      });
    },
    onError: (error) => {
      console.error("Failed to mark notification as read", error);
    },
  });

  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayName} has started following you`,
      icon: <User2 className="text-primary fill-primary size-7" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayName} has commented on your post`,
      icon: <MessageCircle className="text-primary fill-primary size-7" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: `${notification.issuer.displayName} has liked your post`,
      icon: <Heart className="text-primary fill-primary size-7" />,
      href: `/posts/${notification.postId}`,
    },
  };

  const { message, icon, href } = notificationTypeMap[notification.type];

  return (
    <Link
      href={href}
      onClick={() => mutate()}
      className="block hover:no-underline"
    >
      <article
        className={cn(
          "bg-card hover:bg-card/70 flex gap-3 rounded-2xl p-5 shadow-sm transition-colors",
          !notification.read ? "bg-primary/10" : "",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="flex items-start gap-3">
          <Avatar
            avatarUrl={notification.issuer.avatarUrl}
            altText={notification.issuer.username}
            size={36}
          />
          <div className="space-y-3">
            <span className="font-semibold">
              {notification.issuer.displayName}
            </span>
            <p>{message}</p>
            {notification.post ? (
              <p className="text-muted-foreground line-clamp-3 whitespace-pre-line">
                {notification.post.content}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
