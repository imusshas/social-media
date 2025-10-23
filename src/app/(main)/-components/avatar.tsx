import Image from "next/image";
import AvatarPlaceholder from "@/assets/avatar.png";
import { cn } from "@/lib/utils";

type AvatarProps = {
  avatarUrl: string | null;
  altText: string;
  size?: number;
  className?: string;
};

export function Avatar({ avatarUrl, altText, size, className }: AvatarProps) {
  return (
    <Image
      src={avatarUrl ?? AvatarPlaceholder}
      alt={altText}
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "bg-muted-foreground border-foreground aspect-square h-fit flex-none rounded-full border object-cover",
        className,
      )}
      priority
    />
  );
}
