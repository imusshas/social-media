import { MessagesButton } from "@/app/(main)/-components/messages-button";
import { NotificationsButton } from "@/app/(main)/-components/notifications-button";
import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { Bookmark, HomeIcon } from "lucide-react";
import Link from "next/link";

type MenubarProps = {
  className?: string;
  asFooter?: boolean;
};

export async function Menubar({ className, asFooter }: MenubarProps) {
  const { user } = await validateRequest();

  if (!user) {
    return null;
  }

  const [unreadNotificationCount, unreadMessageCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

  const content = asFooter ? (
    <footer className={className}>
      <MenubarItem href="/" icon={<HomeIcon />} title="Home" />
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessageCount }} />
      <MenubarItem href="bookmarks" icon={<Bookmark />} title="Bookmarks" />
    </footer>
  ) : (
    <aside className={className}>
      <MenubarItem href="/" icon={<HomeIcon />} title="Home" />
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessageCount }} />
      <MenubarItem href="bookmarks" icon={<Bookmark />} title="Bookmarks" />
    </aside>
  );
  return content;
}

type MenubarItemProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
};

function MenubarItem({ href, icon, title }: MenubarItemProps) {
  return (
    <Button
      variant={"ghost"}
      className="flex items-center justify-start gap-3"
      title={title}
      asChild
    >
      <Link href={href}>
        {icon}
        <span className="hidden lg:inline">{title}</span>
      </Link>
    </Button>
  );
}
