// app/api/org/[id]/kudos/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { getKudosForOrg } from "@/lib/kudos/getKudosForOrg";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id: organizationId } = await context.params;

  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get("departmentId") ?? undefined;
  const take = parseInt(searchParams.get("take") || "10");
  const skip = parseInt(searchParams.get("skip") || "0");

  const data = await getKudosForOrg({
    organizationId,
    departmentId,
    take,
    skip,
  });

  return NextResponse.json(data);
}


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  const { userId } = await auth();
  const { id: organizationId } = await context.params;

  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const email = clerkUser.emailAddresses?.[0]?.emailAddress;
  if (!email) return NextResponse.json({ error: "User email not found" }, { status: 401 });

  const body = await req.json();
  const { message, recipients }: { message: string; recipients: string[] } = body;

  if (!message || !recipients?.length)
    return NextResponse.json({ error: "Missing message or recipients" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const sender = await prisma.userOnOrganization.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId,
      },
    },
    select: {
      id: true,
      firstName: true, lastName: true,
      user: { select: {  email: true } },
    },
  });
  if (!sender) return NextResponse.json({ error: "Sender not in org" }, { status: 403 });

  try {
    // Create kudos in DB
    const createdKudo = await prisma.kudos.create({
      data: {
        message,
        senderId: sender.id,
        organizationId,
        recipients: {
          create: recipients.map((r) => ({
            userOnOrgId: r,
          })),
        },
      },
    });

    // Get recipients
    const recipientUsers = await prisma.userOnOrganization.findMany({
      where: {
        id: { in: recipients },
      },
      include: {
        user: { select: { email: true } }
      },
    });

    const allRecipientEmails = recipientUsers
      .map((r) => r.user.email)
      .filter(Boolean)
      .concat(sender.user.email);

    const recipientNames = recipientUsers
      .map((r) => `${r.firstName} ${r.lastName}`)
      .join(", ");

    // Construct kudos link
    const baseUrl = process.env.APP_BASE_URL || "https://your-app.com";
    const kudosLink = `${baseUrl}/dashboard/org/${organizationId}/kudos/${createdKudo.id}`;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: sender.user.email,
      bcc: allRecipientEmails.filter((e) => e !== sender.user.email),
      subject: `🎉 Kudos from ${sender.firstName} ${sender.lastName}`,
      text: `Hi ${recipientNames},\n\n${sender.firstName} sent you the following kudos:\n\n"${message}"\n\nView Kudos: ${kudosLink}\n\n– Crew Kudos Team`,
      html: `
      <p style="font-size: 14px;">Hi ${recipientNames},</p>
      <p style="font-size: 14px;"><strong>${sender.firstName} ${sender.lastName}</strong> sent you kudos:</p>
      <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; color: #333; font-size: 14px;">
        ${message}
      </blockquote>
      <p style="font-size: 14px;"><a href="${kudosLink}" style="color: #1d4ed8; text-decoration: underline; font-size: 14px;">Click here to view it in Crew Kudos</a></p>
      <p style="font-size: 14px;">– <em>Crew Kudos Team</em></p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, kudoId: createdKudo.id });
  } catch (error) {
    console.error("Error sending kudos/email:", error);
    return NextResponse.json({ error: "Failed to send kudos" }, { status: 500 });
  }
}