import { Avatar } from "@/app/(main)/-components/avatar";
import { FollowButton } from "@/app/(main)/-components/follow-button";
import { Linkify } from "@/app/(main)/-components/linkify";
import { UserTooltip } from "@/app/(main)/-components/user-tooltip";
import { Post } from "@/app/(main)/posts/post";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude, UserData } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";

type PostDetailsProps = {
  params: Promise<{ postId: string }>;
};

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: getPostDataInclude(loggedInUserId),
  });

  if (!post) notFound();

  return post;
});

export async function generateMetadata({ params }: PostDetailsProps) {
  const { postId } = await params;
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return;
  }

  const post = await getPost(postId, loggedInUser.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function PostDetails({ params }: PostDetailsProps) {
  const { user: loggedInUser } = await validateRequest();
  const { postId } = await params;

  if (!loggedInUser) {
    return (
      <p className="text-destructive text-center">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const post = await getPost(postId, loggedInUser.id);

  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block">
        <Suspense>
          <UserinfoSidebar user={post.user} />
        </Suspense>
      </div>
    </section>
  );
}

type UserinfoSidebarProps = {
  user: UserData;
};

async function UserinfoSidebar({ user }: UserinfoSidebarProps) {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    return null;
  }

  return (
    <div className="bg-card space-y-5 rounded-2xl p-5 shadow-sm">
      <p className="text-xl font-bold">About this user</p>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3 hover:no-underline"
        >
          <Avatar
            avatarUrl={user.avatarUrl}
            altText={user.username}
            className="flex-none"
          />
          <div>
            <p className="line-clamp-1 font-semibold break-all hover:underline">
              {user.displayName}
            </p>
            <p className="text-muted-foreground line-clamp-1 break-all hover:underline">
              {user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="text-muted-foreground line-clamp-6 break-words whitespace-pre-line">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id ? (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              (follower) => follower.followerId === loggedInUser.id,
            ),
          }}
        />
      ) : null}
    </div>
  );
}
