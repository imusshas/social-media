"use client";

import { Avatar } from "@/app/(main)/-components/avatar";
import { FollowButton } from "@/app/(main)/-components/follow-button";
import { FollowerCount } from "@/app/(main)/-components/follower-count";
import { Linkify } from "@/app/(main)/-components/linkify";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSession } from "@/contexts/session-provider";
import { FollowerInfo, UserData } from "@/lib/types";
import Link from "next/link";

type UserTooltipPros = {
  user: UserData;
} & React.PropsWithChildren;

export function UserTooltip({ children, user }: UserTooltipPros) {
  const { user: loggedInUser } = useSession();

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      (follower) => follower.followerId === loggedInUser.id,
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="bg-background text-foreground shadow-sm">
          <div className="flex max-w-80 flex-col gap-3 px-1 py-2.5 break-words md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <Avatar
                  size={70}
                  avatarUrl={user.avatarUrl}
                  altText={user.displayName}
                />
              </Link>
              {loggedInUser.id !== user.id ? (
                <FollowButton userId={user.id} initialState={followerState} />
              ) : null}
            </div>
            <div>
              <Link
                href={`/users/${user.username}`}
                className="hover:no-underline"
              >
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
              </Link>
              {user.bio ? (
                <Linkify>
                  <div className="line-clamp-4 whitespace-pre-line">
                    {user.bio}
                  </div>
                </Linkify>
              ) : null}
              <FollowerCount userId={user.id} initialState={followerState} />
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
