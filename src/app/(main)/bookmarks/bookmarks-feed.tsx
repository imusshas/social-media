"use client";

import { Post } from "@/app/(main)/posts/post";
import { InfiniteScrollContainer } from "@/app/(main)/-components/infinite-scroll-container";
import {
  PostLoadingSkeleton,
  PostsLoadingSkeleton,
} from "@/app/(main)/-components/posts-loading-skeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export function BookmarkFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "bookmarks"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "api/posts/bookmarked",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
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
        An error occurred while loading bookmarks.
      </p>
    );
  }

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (status === "success" && posts.length === 0 && !hasNextPage) {
    return (
      <h2 className="text-muted-foreground text-center">
        You don&apos;t have any bookmarks yet.
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
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage ? <PostLoadingSkeleton /> : null}
    </InfiniteScrollContainer>
  );
}
