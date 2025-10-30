"use client";

import { logout } from "@/app/(auth)/actions";
import { Avatar } from "@/app/(main)/-components/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/contexts/session-provider";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

type UserButtonProps = {
  className?: string;
};

export function UserButton({ className }: UserButtonProps) {
  const { user } = useSession();
  const queryClient = useQueryClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "bg-foreground flex-none cursor-pointer rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
            className,
          )}
        >
          <Avatar
            avatarUrl={user.avatarUrl}
            altText={user.displayName}
            size={40}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/users/${user.username}`} className="text-muted-foreground">
          {user.username}
        </Link>
        <DropdownMenuItem className="cursor-pointer">
          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-2 hover:no-underline"
          >
            <UserIcon className="mr-2 size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <ThemeDropdown />
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            queryClient.clear();
            logout();
          }}
          className="cursor-pointer"
        >
          <LogOutIcon className="text-destructive mr-2 size-4" />
          <span className="text-destructive">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeDropdown() {
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="cursor-pointer">
        <Monitor className="mr-2 size-4" /> Theme
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 size-4" /> System
            {theme === "system" ? <Check className="ms-2 size-4" /> : null}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 size-4" /> Light
            {theme === "light" ? <Check className="ms-2 size-4" /> : null}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 size-4" /> Dark
            {theme === "dark" ? <Check className="ms-2 size-4" /> : null}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
