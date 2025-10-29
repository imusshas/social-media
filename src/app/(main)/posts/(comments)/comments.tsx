import { Avatar } from "@/app/(main)/-components/avatar";
import { UserTooltip } from "@/app/(main)/-components/user-tooltip";
import { CommentInput } from "@/app/(main)/posts/(comments)/comment-input";
import { CommentMenu } from "@/app/(main)/posts/(comments)/comment-menu";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/session-provider";
import kyInstance from "@/lib/ky";
import { CommentData, CommentsPage, PostData } from "@/lib/types";
import { formatRelativeDate } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";

type CommentsProps = {
  post: PostData;
};

export function Comments({ post }: CommentsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["comments", post.id],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `api/posts/${post.id}/comments`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<CommentsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (firstPage) => firstPage.previousCursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];
  const noComment =
    status === "success" && comments.length === 0 && !hasNextPage;

  return (
    <div className="space-y-3 p-5">
      <CommentInput post={post} />
      {hasNextPage ? (
        <Button
          variant={"link"}
          className="mx-auto flex items-center justify-center gap-1 hover:no-underline"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load more comments{" "}
          {isFetchingNextPage ? <Loader2 className="animate-spin" /> : null}
        </Button>
      ) : null}
      {status === "pending" ? (
        <Loader2 className="mx-auto animate-spin" />
      ) : null}
      {status === "error" ? (
        <p className="text-destructive text-center">
          An error occurred while loading comments.
        </p>
      ) : null}
      {noComment ? (
        <p className="text-muted-foreground text-center">
          Be the first to comment on this post.
        </p>
      ) : (
        <div className="divide-y">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

type CommentProps = {
  comment: CommentData;
};

function Comment({ comment }: CommentProps) {
  const { user: loggedInUser } = useSession();
  return (
    <div className="group/comment flex items-start justify-between gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <Avatar
              avatarUrl={comment.user.avatarUrl}
              altText={comment.user.username}
            />
          </Link>
        </UserTooltip>
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-semibold"
            >
              {comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {comment.user.id === loggedInUser.id ? (
        <CommentMenu
          comment={comment}
          className="opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      ) : null}
    </div>
  );
}
