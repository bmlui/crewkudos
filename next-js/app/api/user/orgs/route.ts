// app/api/user/orgs/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getOrgsForUser } from "@/lib/orgs/getOrgsForUser";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch email using Clerk API
  try {
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const user = await getOrgsForUser(userEmail);
    const orgs = user?.orgLinks.map((link: any) => ({
      id: link.organization.id,
      name: link.organization.name,
    })) || [];

    return NextResponse.json(orgs);
  } catch (error) {
    console.error("Error fetching Clerk user or orgs:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}