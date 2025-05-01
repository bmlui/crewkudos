// app/api/org/[id]/users/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id: orgId } = await context.params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user email from Clerk
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userInOrg = await prisma.userOnOrganization.findFirst({
    where: {
      userId: user.id,
      organizationId: orgId,
    },
  });

  if (!userInOrg) {
    return NextResponse.json({ error: "User not part of the organization" }, { status: 403 });
  }

  const users = await prisma.userOnOrganization.findMany({
    where: { organizationId: orgId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      department: {
        select: { name: true },
      },
    },
  });

  const formatted = users.map((u) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName} (${u.department?.name || "No Dept"})`,
  }));

  return NextResponse.json(formatted);
}