"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import streamServerClient from "@/lib/stream";
import { getUserDataSelect } from "@/lib/types";
import {
  UpdateUserProfileSchema,
  UpdateUserProfileValues,
} from "@/lib/validation";

export async function updateUserProfile(values: UpdateUserProfileValues) {
  const validatedValues = UpdateUserProfileSchema.parse(values);

  const { user: loggedInUser } = await validateRequest();

  if (!loggedInUser) {
    throw new Error("Unauthorized");
  }

  const updatedUser = prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: loggedInUser.id },
      data: validatedValues,
      select: getUserDataSelect(loggedInUser.id),
    });
    
    await streamServerClient.partialUpdateUser({
      id: loggedInUser.id,
      set: {
        name: validatedValues.displayName,
      },
    });

    return updatedUser;
  });

  return updatedUser;
}
