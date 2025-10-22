"use client";

import { PostMenu } from "@/app/(main)/(posts)/post-menu";
import { Avatar } from "@/app/(main)/-components/avatar";
import { Linkify } from "@/app/(main)/-components/linkify";
import { useSession } from "@/contexts/session-provider";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";

type PostProps = {
  post: PostData;
};
export function Post({ post }: PostProps) {
  const { user } = useSession();

  return (
    <article className="group/post bg-card space-y-3 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.user.username}`}>
            <Avatar
              avatarUrl={post.user.avatarUrl}
              altText={post.user.username}
            />
          </Link>
          <div className="flex flex-col">
            <Link href={`/users/${post.user.username}`}>
              <h2 className="font-medium">{post.user.displayName}</h2>
            </Link>
            <Link
              href={`/posts/${post.id}`}
              className="text-muted-foreground text-sm"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id ? (
          <PostMenu
            post={post}
            className="group-hover/post:opacity-100 opacity-0 transition-opacity"
          />
        ) : null}
      </div>
      <Linkify>
        <p className="break-words whitespace-pre-line">{post.content}</p>
      </Linkify>
    </article>
  );
}
