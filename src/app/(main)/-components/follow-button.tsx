"use client";

import { Button } from "@/components/ui/button";
import { useFollowerInfo } from "@/hooks/useFollowerInfo";
import kyInstance from "@/lib/ky";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type FollowButtonProps = {
  userId: string;
  initialState: FollowerInfo;
};

export function FollowButton({ userId, initialState }: FollowButtonProps) {
  const { data } = useFollowerInfo(userId, initialState);
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },

    onError: (error, variable, context) => {
      queryClient.setQueryData<FollowerInfo>(queryKey, context?.previousState);
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    },
  });

  return (
    <Button
      variant={data.isFollowedByUser ? "secondary" : "default"}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
