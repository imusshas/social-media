"use client";

import kyInstance from "@/lib/ky";
import { BookmarkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

type BookmarkButtonProps = {
  postId: string;
  initialState: BookmarkInfo;
};

export function BookmarkButton({ postId, initialState }: BookmarkButtonProps) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["bookmark-info", postId];

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/bookmark`).json<BookmarkInfo>(),
    initialData: initialState,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? kyInstance.delete(`/api/posts/${postId}/bookmark`)
        : kyInstance.post(`/api/posts/${postId}/bookmark`),

    onMutate: async () => {
      toast(`Post ${data.isBookmarkedByUser ? "un" : ""}bookmarked`);

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },

    onError: (error, variable, context) => {
      queryClient.setQueryData<BookmarkInfo>(queryKey, context?.previousState);
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <button
      onClick={() => mutate()}
      className="flex flex-1 items-center justify-center gap-2 p-3"
    >
      <Bookmark
        className={cn(
          "size-5",
          data.isBookmarkedByUser
            ? "fill-primary text-primary"
            : "text-foreground fill-none",
        )}
      />
      <span
        className={cn(
          "hidden text-sm font-medium sm:inline",
          data.isBookmarkedByUser ? "text-primary" : "text-foreground",
        )}
      >
        {data.isBookmarkedByUser ? "Unbookmark" : "Bookmark"}
      </span>
    </button>
  );
}
