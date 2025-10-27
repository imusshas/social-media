"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Avatar } from "@/app/(main)/-components/avatar";
import { useSession } from "@/contexts/session-provider";
import "@/app/(main)/(posts)/(editor)/styles.css";
import { useRef, useState } from "react";
import { useSubmitPostMutation } from "@/app/(main)/(posts)/(editor)/mutations";
import { LoadingButton } from "@/components/loading-button";
import {
  Attachment,
  useMediaUpload,
} from "@/app/(main)/(posts)/(editor)/use-media-upload";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function PostEditor() {
  const { user } = useSession();

  const [editorContent, setEditorContent] = useState<string>("");

  const { mutate, isPending } = useSubmitPostMutation();

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads,
  } = useMediaUpload();

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
    mutate(
      {
        content: editorContent,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
        },
      },
    );
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
      {!!attachments.length ? (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      ) : null}
      <div className="flex items-center justify-end gap-3">
        {isUploading ? (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="text-primary size-5 animate-spin" />
          </>
        ) : null}
        <AddAttachmentButton
          onFileSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          onClick={onsubmit}
          disabled={!editorContent.trim() || isPending || isUploading}
          loading={isPending}
          className="min-w-20 cursor-pointer"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}

type AddAttachmentsButtonProps = {
  onFileSelected: (files: File[]) => void;
  disabled: boolean;
};

function AddAttachmentButton({
  onFileSelected,
  disabled,
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="text-primary hover:text-primary"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
      >
        <ImageIcon size={20} />
        <input
          type="file"
          accept="image/*, video/*"
          multiple
          ref={fileInputRef}
          className="sr-only hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);

            if (files.length) {
              onFileSelected(files);
              e.target.value = "";
            }
          }}
        />
      </Button>
    </>
  );
}

type AttachmentPreviewsProps = {
  attachments: Attachment[];
  removeAttachment: (filename: string) => void;
};

function AttachmentPreviews({
  attachments,
  removeAttachment,
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 ? "sm:grid sm:grid-cols-2" : null,
      )}
    >
      {attachments.map((a) => (
        <AttachmentPreview
          key={a.file.name}
          attachment={a}
          onRemoveClick={() => removeAttachment(a.file.name)}
        />
      ))}
    </div>
  );
}

type AttachmentPreviewProps = {
  attachment: Attachment;
  onRemoveClick: () => void;
};

function AttachmentPreview({
  attachment,
  onRemoveClick,
}: AttachmentPreviewProps) {
  const { file, mediaId, isUploading } = attachment;
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn(
        "relative mx-auto size-fit",
        isUploading ? "opacity-50" : null,
      )}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="attachment preview"
          height={500}
          width={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {!isUploading ? (
        <button
          onClick={onRemoveClick}
          className="bg-foreground text-background hover:bg-background/60 absolute top-3 right-3 rounded-full p-1.5 transition-colors"
        >
          <X size={20} />
        </button>
      ) : null}
    </div>
  );
}
