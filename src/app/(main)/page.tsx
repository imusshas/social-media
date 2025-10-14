import { PostEditor } from "@/app/(main)/(posts)/(editor)/post-editor";
import { ForYouFeed } from "@/app/(main)/-components/for-you-feed";
import { Sidebar } from "@/app/(main)/-components/side-bar";

export default async function Home() {
  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <ForYouFeed />
      </div>
      <Sidebar />
    </section>
  );
}
