import { DeletePostDialog } from "@/app/(main)/(posts)/delete-post-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { PostData } from "@/lib/types";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

type PostMenuProps = {
  post: PostData;
  className?: string;
};

export function PostMenu({ post, className }: PostMenuProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"} className={className}>
            <MoreHorizontal className="text-muted-foreground size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="flex cursor-pointer items-center justify-between gap-3"
          >
            <span className="text-destructive">Delete</span>
            <Trash2 className="text-destructive size-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeletePostDialog
        post={post}
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
