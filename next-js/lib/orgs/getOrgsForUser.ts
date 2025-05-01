// lib/queries/getOrgsForUser.ts
import { prisma } from "@/lib/prisma";

export async function getOrgsForUser(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      orgLinks: {
        include: {
          organization: true,
        },
      },
    },
  });
}