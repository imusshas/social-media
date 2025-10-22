import { Avatar } from "@/app/(main)/-components/avatar";
import { FollowButton } from "@/app/(main)/-components/follow-button";
import { UserTooltip } from "@/app/(main)/-components/user-tooltip";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";

export function Sidebar() {
  return (
    <aside className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <Follow />
        <TrendingTopics />
      </Suspense>
    </aside>
  );
}

async function Follow() {
  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) return null;

  const users = await prisma.user.findMany({
    where: {
      NOT: {
        id: loggedInUser.id,
      },
      followers: {
        none: {
          followerId: loggedInUser.id,
        },
      },
    },
    select: getUserDataSelect(loggedInUser.id),
    take: 5,
  });

  return (
    <article className="bg-card space-y-5 rounded-2xl p-5 shadow-sm">
      <h3 className="text-xl font-bold">Follow</h3>
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3 hover:no-underline"
            >
              <Avatar
                avatarUrl={user.avatarUrl}
                altText={user.displayName}
                className="flex-none"
              />
              <div>
                <p className="line-clamp-1 font-semibold break-all hover:underline">
                  {user.displayName}
                </p>
                <p className="text-muted-foreground line-clamp-1 break-all">
                  @{user.username}
                </p>
              </div>
            </Link>
          </UserTooltip>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                (follower) => follower.followerId === loggedInUser.id,
              ),
            }}
          />
        </div>
      ))}
    </article>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const { user } = await validateRequest();

  if (!user) return null;

  const trendingTopics = await getTrendingTopics();

  return (
    <article className="bg-card space-y-5 rounded-2xl p-5 shadow-sm">
      <h3 className="text-xl font-bold">Trending Topics</h3>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];
        return (
          <Link
            key={title}
            href={`/hashtag/${title}`}
            className="block hover:no-underline"
          >
            <p
              className="line-clamp-1 font-semibold break-all hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-muted-foreground text-sm">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </article>
  );
}
