import { Avatar } from "@/app/(main)/-components/avatar";
import { PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import Link from "next/link";

type PostProps = {
  post: PostData;
};
export function Post({ post }: PostProps) {
  return (
    <article className="bg-card space-y-3 rounded-2xl p-5 shadow-sm">
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
      <p className="break-words whitespace-pre-line">{post.content}</p>
    </article>
  );
}
