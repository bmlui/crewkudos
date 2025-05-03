import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import KudosFeed from "@/app/dashboard/org/components/KudosFeed";
import SendKudos from "../components/SendKudos";
import { Suspense } from "react";

export default async function OrgPage({
  params,
}: {
  params: { orgId: string };
}) {
  const session = await auth();
  const userEmail = (session as any)?.user?.email;

  if (!userEmail) {
    return new Response("Forbidden", { status: 403 });
  }

  const { orgId } = await params;

  const org = await prisma.organization.findUnique({
    where: { id: orgId },
  });
  if (!org) notFound();

  const dbUser = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!dbUser) return new Response("Forbidden", { status: 403 });

  const userLink = await prisma.userOnOrganization.findUnique({
    where: {
      userId_organizationId: {
        userId: dbUser.id,
        organizationId: org.id,
      },
    },
    select: {
      firstName: true,
      lastName: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  if (!userLink) {
    return new Response("Forbidden", { status: 403 });
  }

  const departmentName = userLink?.department?.name || "No department assigned";

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">{org.name}</h1>
      <p className="text-gray-500">Department: {departmentName}</p>
      <SendKudos
        orgId={orgId}
        senderName={`${userLink?.firstName ?? ""} ${userLink?.lastName ?? ""}`}
        myDeptName={userLink?.department?.name}
      />

      <KudosFeed
        orgId={orgId}
        {...(userLink?.department?.id && {
          defaultDeptId: userLink.department.id,
          defaultDeptName: userLink.department.name,
        })}
      />
    </main>
  );
}
