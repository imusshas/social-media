import { NotificationsButton } from "@/app/(main)/-components/notifications-button";
import { validateRequest } from "@/auth";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Bookmark, HomeIcon, Mail } from "lucide-react";
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

  const unreadCount = await prisma.notification.count({
    where: {
      recipientId: user.id,
      read: false,
    },
  });

  const content = asFooter ? (
    <footer className={className}>
      <MenubarItem href="/" icon={<HomeIcon />} title="Home" />
      <NotificationsButton initialState={{ unreadCount }} />
      <MenubarItem href="/messages" icon={<Mail />} title="Messages" />
      <MenubarItem href="bookmarks" icon={<Bookmark />} title="Bookmarks" />
    </footer>
  ) : (
    <aside className={className}>
      <MenubarItem href="/" icon={<HomeIcon />} title="Home" />
      <NotificationsButton initialState={{ unreadCount }} />
      <MenubarItem href="/messages" icon={<Mail />} title="Messages" />
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
