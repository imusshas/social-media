import { Avatar } from "@/app/(main)/-components/avatar";
import { FollowButton } from "@/app/(main)/-components/follow-button";
import { FollowerCount } from "@/app/(main)/-components/follower-count";
import { Linkify } from "@/app/(main)/-components/linkify";
import { Sidebar } from "@/app/(main)/-components/side-bar";
import { UserPostsFeed } from "@/app/(main)/users/[username]/user-posts-feed";
import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { FollowerInfo, getUserDataSelect, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";
import { notFound } from "next/navigation";
import { cache } from "react";

type UserProfileProps = {
  params: Promise<{ username: string }>;
};

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: { username: { equals: username, mode: "insensitive" } },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) {
    notFound();
  }

  return user;
});

export async function generateMetadata({ params }: UserProfileProps) {
  const { user: loggedInUser } = await validateRequest();
  const { username } = await params;

  if (!loggedInUser) {
    return {};
  }

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function UserProfile({ params }: UserProfileProps) {
  const { user: loggedInUser } = await validateRequest();
  const { username } = await params;

  if (!loggedInUser) {
    return (
      <p className="text-destructive text-center">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Profile user={user} loggedInUserId={loggedInUser.id} />
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.displayName}&apos;s posts
          </h2>
        </div>
        <UserPostsFeed userId={user.id} />
      </div>
      <Sidebar />
    </section>
  );
}

type ProfileProps = {
  user: UserData;
  loggedInUserId: string;
};

async function Profile({ user, loggedInUserId }: ProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      (follower) => follower.followerId === loggedInUserId,
    ),
  };

  return (
    <div className="bg-card h-fit w-full space-y-5 rounded-2xl border p-5">
      <Avatar
        avatarUrl={user.avatarUrl}
        altText={user.displayName}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
          <p>Member since {formatDate(user.createdAt, "MMM d, yyyy")}</p>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit Profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio ? (
        <>
          <hr />
          <Linkify>
            <p className="overflow-hidden break-words whitespace-pre-line">
              {user.bio}
            </p>
          </Linkify>
        </>
      ) : null}
    </div>
  );
}
