import { PostEditor } from "@/app/(main)/(posts)/(editor)/post-editor";
import { FollowingFeed } from "@/app/(main)/-components/following-feed";
import { ForYouFeed } from "@/app/(main)/-components/for-you-feed";
import { Sidebar } from "@/app/(main)/-components/side-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Home() {
  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList className="w-full">
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <Sidebar />
    </section>
  );
}
