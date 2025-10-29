import { useSubmitCommentMutation } from "@/app/(main)/posts/(comments)/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostData } from "@/lib/types";
import { Loader2, SendHorizonal } from "lucide-react";
import { useState } from "react";

type CommentInputProps = {
  post: PostData;
  disabled?: boolean;
};

export function CommentInput({ post, disabled }: CommentInputProps) {
  const [input, setInput] = useState<string>("");
  const { mutate, isPending } = useSubmitCommentMutation(post.id);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!input) return;

    mutate(
      { post, content: input },
      {
        onSuccess: () => {
          setInput("");
        },
      },
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full items-center gap-2">
      <Input
        name="comment"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoComplete="off"
        placeholder="Write a comment ..."
        autoFocus
      />

      <Button
        type="submit"
        variant={"ghost"}
        size={"icon"}
        disabled={!input.trim() || isPending || disabled}
      >
        {isPending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <SendHorizonal
            className={`size-5 ${disabled ? "text-muted-foreground" : null}`}
          />
        )}
      </Button>
    </form>
  );
}
