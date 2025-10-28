import { Sidebar } from "@/app/(main)/-components/side-bar";
import { BookmarkFeed } from "@/app/(main)/bookmarks/bookmarks-feed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
};

export default function Bookmarks() {
  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Bookmarks</h1>
        </div>
        <BookmarkFeed />
      </div>
      <Sidebar />
    </section>
  );
}
