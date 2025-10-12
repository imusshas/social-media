"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CreatePostSchema } from "@/lib/validation";

export async function submitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { content } = CreatePostSchema.parse({ content: input });

  await prisma.post.create({
    data: {
      content: content,
      userId: user.id,
    },
  });
}
