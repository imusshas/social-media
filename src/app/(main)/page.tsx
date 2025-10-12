import { PostEditor } from "@/app/(main)/(posts)/(editor)/post-editor";
import { Post } from "@/app/(main)/(posts)/post";
import { Sidebar } from "@/app/(main)/-components/side-bar";
import prisma from "@/lib/prisma";
import { postDataIncludes } from "@/lib/types";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: postDataIncludes,
    orderBy: { createdAt: "desc" },
  });
  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      <Sidebar />
    </section>
  );
}
