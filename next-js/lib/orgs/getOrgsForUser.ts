// lib/queries/getOrgsForUser.ts
import { prisma } from "@/lib/prisma";

export async function getOrgsForUser(id: string) {
  if (!id || id.length === 0) {
    throw new Error("User ID is required");
  }
  return await prisma.user.findUnique({
    where: { id },
    include: {
      orgLinks: {
        include: {
          organization: true,
        },
      },
    },
  });
}