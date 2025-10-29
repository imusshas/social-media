import { useDeleteCommentMutation } from "@/app/(main)/posts/(comments)/mutations";
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
import { CommentData } from "@/lib/types";

type DeleteCommentDialogProps = {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
};

export function DeleteCommentDialog({
  comment,
  open,
  onClose,
}: DeleteCommentDialogProps) {
  const { mutate, isPending } = useDeleteCommentMutation();

  function handleOpenChange(open: boolean) {
    if (!open && !isPending) {
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Comment?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure to delete this comment? This action cannot be undone.
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
            onClick={() => mutate(comment.id, { onSuccess: onClose })}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
