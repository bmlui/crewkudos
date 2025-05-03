import { prisma } from "@/lib/prisma";

export async function getRecentKudosForUser(id: string, take = 5) {
  if (!id || id.length === 0) {
    throw new Error("User ID is required");
  }

  return await prisma.kudos.findMany({
    where: {
      recipients: {
        some: {
          userOnOrg: {
            userId: id,
          },
        },
      },
    },
    include: {
      organization: {
        select: { name: true },
      },
      sender: {
        select: {
          firstName: true,
          lastName: true,
          department: {
            select: { name: true },
          },
        },
      },
      recipients: {
        include: {
          userOnOrg: {
            select: {
              firstName: true,
              lastName: true,
              department: {
                select: { name: true },
              },
              user: {
                select: { email: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: take,
  });
}
