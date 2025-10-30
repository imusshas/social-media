import { Sidebar } from "@/app/(main)/-components/side-bar";
import { MarkAsRead } from "@/app/(main)/notifications/mark-as-read";
import { NotificationsFeed } from "@/app/(main)/notifications/notifications-feed";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function Notifications() {
  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card flex items-center justify-between gap-3 rounded-2xl p-5 shadow-sm">
          <h1 className="text-2xl font-bold">Notifications</h1>
          <MarkAsRead />
        </div>
        <NotificationsFeed />
      </div>
      <Sidebar />
    </section>
  );
}
