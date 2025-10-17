import { useDeletePostMutation } from "@/app/(main)/(posts)/mutations";
import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostData } from "@/lib/types";

type DeletePostDialog = {
  post: PostData;
  open: boolean;
  onClose: () => void;
};

export function DeletePostDialog({ post, open, onClose }: DeletePostDialog) {
  const { mutate, isPending } = useDeletePostMutation();

  function handleOpenChange(open: boolean) {
    if (!open && !isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure to delete this post? This action cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} disabled={isPending} onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <LoadingButton
            variant={"destructive"}
            loading={isPending}
            disabled={isPending}
            onClick={() => mutate(post.id, { onSuccess: onClose })}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
