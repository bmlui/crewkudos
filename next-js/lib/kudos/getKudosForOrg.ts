import { prisma } from "@/lib/prisma";

export async function getKudosForOrg({
  organizationId,
  departmentId,
  take = 10,
  skip = 0,
}: {
  organizationId: string;
  departmentId?: string;
  take?: number;
  skip?: number;
}) {
  return await prisma.kudos.findMany({
    where: {
      organizationId,
      ...(departmentId && {
        recipients: {
          some: {
            userOnOrg: {
              organizationId,
              departmentId,
            },
          },
        },
      }),
    },
    include: {
      organization: true,
      sender: {
        select: {
          firstName: true,
          lastName: true,
          department: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              email: true,
            },
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
                select: {
                  name: true,
                },
              },
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take,
    skip,
  });
}

export type KudosForOrg = NonNullable<
  Awaited<ReturnType<typeof getKudosForOrg>>
>;