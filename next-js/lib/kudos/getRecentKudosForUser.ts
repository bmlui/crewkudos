import { prisma } from "@/lib/prisma";

export async function getRecentKudosForUser(email: string, take = 5) {
  // Step 1: Get the user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }
  const userLinks = await prisma.userOnOrganization.findMany({
    where: { userId: user.id },
    select: { id: true },
  });

  const userOnOrgIds = userLinks.map((link: { id: any; }) => link.id); // 👈 THIS is required!
  if (!userOnOrgIds.length) {
    return [];
  }
  // Step 2: Get all UserOnOrg records (just IDs) for this user
  return await prisma.kudos.findMany({
    where: {
      recipients: {
        some: {
          userOnOrgId: { in: userOnOrgIds },
        },
      },
    },
    include: {
      organization: {select: 
        {name: true}},
      sender: {
        select: {
          firstName: true,
          lastName: true,
          department: {
            select: { name: true },
          }
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