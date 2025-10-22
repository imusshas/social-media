import { submitPost } from "@/app/(main)/(posts)/(editor)/actions";
import { useSession } from "@/contexts/session-provider";
import { PostsPage } from "@/lib/types";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export function useSubmitPostMutation() {
  const { user: loggedInUser } = useSession();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate: (query) => {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(loggedInUser.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);
      
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate: (query) => {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast.success("Post created");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to post. Please try again");
    },
  });

  return { mutate, isPending };
}
