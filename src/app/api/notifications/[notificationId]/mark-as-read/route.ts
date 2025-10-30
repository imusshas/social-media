import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { NotificationCountInfo } from "@/lib/types";

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{ notificationId: string }>;
  },
) {
  try {
    const { notificationId } = await context.params;
    const { user } = await validateRequest();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, unreadCount] = await prisma.$transaction([
      prisma.notification.updateMany({
        where: {
          id: notificationId,
          recipientId: user.id,
          read: false,
        },
        data: {
          read: true,
        },
      }),
      prisma.notification.count({
        where: {
          recipientId: user.id,
          read: false,
        },
      }),
    ]);

    const data: NotificationCountInfo = {
      unreadCount: unreadCount,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
