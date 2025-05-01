import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  const { id: organizationId } = await context.params;
  const departments = await prisma.department.findMany({
    where: { organizationId },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(departments);
}