// app/api/user/orgs/route.ts
import { auth } from "@/auth";
import { getOrgsForUser } from "@/lib/orgs/getOrgsForUser";
import { NextResponse } from "next/server";
import type { OrgsForUser } from "@/lib/orgs/getOrgsForUser";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
  

    const user = await getOrgsForUser(userId);
    const orgs = user?.orgLinks.map((link: OrgsForUser["orgLinks"][number]) => ({
      id: link.organization.id,
      name: link.organization.name,
    })) || [];

    return NextResponse.json(orgs);
  } catch (error) {
    console.error("Error fetching user or orgs:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}