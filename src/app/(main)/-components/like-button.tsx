"use client";

import kyInstance from "@/lib/ky";
import { LikeInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { toast } from "sonner";

type LikeButtonProps = {
  postId: string;
  initialState: LikeInfo;
};

export function LikeButton({ postId, initialState }: LikeButtonProps) {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["like-info", postId];

  const { data } = useQuery({
    queryKey: queryKey,
    queryFn: () =>
      kyInstance.get(`/api/posts/${postId}/likes`).json<LikeInfo>(),
    initialData: initialState,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? kyInstance.delete(`/api/posts/${postId}/likes`)
        : kyInstance.post(`/api/posts/${postId}/likes`),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
      }));

      return { previousState };
    },

    onError: (error, variable, context) => {
      queryClient.setQueryData<LikeInfo>(queryKey, context?.previousState);
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <button
      onClick={() => mutate()}
      className="flex flex-1 items-center justify-center gap-2 border-r p-3"
    >
      <Heart
        className={cn(
          "size-5",
          data.isLikedByUser
            ? "fill-primary text-primary"
            : "text-foreground fill-none",
        )}
      />
      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          data.isLikedByUser ? "text-primary" : "text-foreground",
        )}
      >
        {data.likes}{" "}
        <span className="hidden sm:inline">
          {data.likes !== 1 ? "likes" : "like"}
        </span>
      </span>
    </button>
  );
}
