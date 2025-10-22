"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Avatar } from "@/app/(main)/-components/avatar";
import { useSession } from "@/contexts/session-provider";
import "@/app/(main)/(posts)/(editor)/styles.css";
import { useState } from "react";
import { useSubmitPostMutation } from "@/app/(main)/(posts)/(editor)/mutations";
import { LoadingButton } from "@/components/loading-button";

export function PostEditor() {
  const { user } = useSession();

  const [editorContent, setEditorContent] = useState<string>("");

  const { mutate, isPending } = useSubmitPostMutation();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bold: false, italic: false }),
      Placeholder.configure({ placeholder: "What's in your mind?" }),
    ],
    immediatelyRender: false,
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(
        editor
          .getHTML()
          .slice(3)
          .replaceAll("<p>", "\n")
          .replaceAll("</p>", ""),
      );
    },
  });

  async function onsubmit() {
    mutate(editorContent, {
      onSuccess: () => {
        editor?.commands.clearContent();
      },
    });
  }

  return (
    <div className="bg-card flex flex-col gap-5 rounded-2xl p-5">
      <div className="flex gap-5">
        <Avatar
          avatarUrl={user.avatarUrl}
          altText={user.displayName}
          className="hidden sm:inline"
        />
        <EditorContent
          editor={editor}
          className="dark:bg-input/30 border-input max-h-[20rem] w-full min-w-0 overflow-y-auto rounded-md border bg-transparent p-3 text-base shadow-xs transition-[color,box-shadow] outline-none"
        />
      </div>
      <div className="flex justify-end">
        <LoadingButton
          onClick={onsubmit}
          disabled={!editorContent.trim() || isPending}
          loading={isPending}
          className="min-w-20 cursor-pointer"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}
