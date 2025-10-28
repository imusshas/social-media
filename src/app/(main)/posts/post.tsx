"use client";

import { PostMenu } from "@/app/(main)/posts/post-menu";
import { Avatar } from "@/app/(main)/-components/avatar";
import { Linkify } from "@/app/(main)/-components/linkify";
import { UserTooltip } from "@/app/(main)/-components/user-tooltip";
import { useSession } from "@/contexts/session-provider";
import { PostData } from "@/lib/types";
import { cn, formatRelativeDate } from "@/lib/utils";
import { Media } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { LikeButton } from "@/app/(main)/-components/like-button";

type PostProps = {
  post: PostData;
};
export function Post({ post }: PostProps) {
  const { user: loggedInUser } = useSession();

  return (
    <article className="group/post bg-card space-y-3 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <Avatar
                avatarUrl={post.user.avatarUrl}
                altText={post.user.username}
              />
            </Link>
          </UserTooltip>

          <div className="flex flex-col">
            <UserTooltip user={post.user}>
              <Link href={`/users/${post.user.username}`}>
                <h2 className="font-medium">{post.user.displayName}</h2>
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="text-muted-foreground text-sm"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === loggedInUser.id ? (
          <PostMenu
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        ) : null}
      </div>
      <Linkify>
        <p className="break-words whitespace-pre-line">{post.content}</p>
      </Linkify>
      {!!post.attachments ? (
        <MediaPreviews attachments={post.attachments} />
      ) : null}
      <hr className="text-muted-foreground" />
      <LikeButton
        postId={post.id}
        initialState={{
          likes: post._count.likes,
          isLikedByUser: post.likes.some((like) => like.userId === loggedInUser.id),
        }}
      />
    </article>
  );
}

type MediaPreviewsProps = {
  attachments: Media[];
};

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 ? "sm:grid sm:grid-cols-2" : null,
      )}
    >
      {attachments.map((m) => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  );
}

type MediaPreviewProps = {
  media: Media;
};

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type !== "IMAGE" && media.type !== "VIDEO") {
    return <p className="text-destructive">Unsupported media type</p>;
  }

  return media.type === "IMAGE" ? (
    <Image
      src={media.url}
      alt="attachment"
      width={500}
      height={500}
      className="mx-auto size-fit max-h-[30rem] rounded-2xl"
    />
  ) : (
    <div>
      <video controls className="mx-auto size-fit max-h-[30rem] rounded-2xl">
        <source src={media.url} />
      </video>
    </div>
  );
}
