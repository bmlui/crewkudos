// app/api/org/[id]/users/route.ts
import {auth} from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth(); // ✅ Modern Auth.js v5
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: orgId } = await context.params;

  // Fetch users and check if the requesting user is part of the organization in a single query
  const users = await prisma.userOnOrganization.findMany({
    where: { organizationId: orgId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      department: {
        select: { name: true },
      },
      userId: true, // Include userId to verify the requesting user
    },
  });

  // Check if the requesting user is part of the organization
  const isUserPartOfOrg = users.some((u: { userId: string | undefined; }) => u.userId === session?.user?.id);

  if (!isUserPartOfOrg) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ error: "No users found" }, { status: 404 });
  }
  if (!users) return NextResponse.json({ error: "No users found" }, { status: 404 });

  const formatted = users.map((u) => ({
    id: u.id,
    name: `${u.firstName} ${u.lastName} (${u.department?.name || "No Dept"})`,
  }));

  return NextResponse.json(formatted);
}