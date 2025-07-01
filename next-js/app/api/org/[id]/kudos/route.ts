import { auth } from "@/auth";
import { getKudosForOrg } from "@/lib/kudos/getKudosForOrg";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Prisma } from "@prisma/client";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
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

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const session = await auth(); // ✅ Modern Auth.js v5
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.user.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: organizationId } = await context.params;

  const body = await req.json();
  const { message, recipients }: { message: string; recipients: string[] } = body;

  if (!message || !recipients?.length)
    return NextResponse.json({ error: "Missing message or recipients" }, { status: 400 });

  if (message.length > 800) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  if (recipients.length > 5) {
    return NextResponse.json({ error: "Too many recipients" }, { status: 400 });
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length <= 1) {
    return NextResponse.json({ error: "Message too short" }, { status: 400 });
  }

  const sender = await prisma.userOnOrganization.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId,
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      user: { select: { email: true } },
    },
  });
  if (!sender) return NextResponse.json({ error: "Sender not in org" }, { status: 403 });

  try {
    const createdKudo = await prisma.kudos.create({
      data: {
        message: trimmedMessage,
        senderId: sender.id,
        organizationId,
        recipients: {
          create: recipients.map((r) => ({
            userOnOrgId: r,
          })),
        },
      },
    });
type RecipientUser = Prisma.UserOnOrganizationGetPayload<{
  include: { user: { select: { email: true } } };
}>;

    const recipientUsers = await prisma.userOnOrganization.findMany({
      where: { id: { in: recipients } },
      include: { user: { select: { email: true } } },
    });
//helper function to format email addresses
    const formatAddress = (
      first?: string | null,
      last?: string | null,
      email?: string | null,
    ) => {
      if (!email) return undefined;               // skip blanks
      const name = [first, last].filter(Boolean).join(" ");
      return name ? `"${name}" <${email}>` : email;
    };
    
    // Build the To: list
    const allRecipientAddrs = [
      ...recipientUsers
        .map((r: RecipientUser) => formatAddress(r.firstName, r.lastName, r.user.email))
        .filter(Boolean),                         // drop undefineds
      formatAddress(sender.firstName, sender.lastName, sender.user.email),
    ]
      // optional: deduplicate
      .filter((addr, i, arr) => addr && arr.indexOf(addr) === i);
    

    const recipientNames = recipientUsers
      .map((r) => `${r.firstName} ${r.lastName}`)
      .join(", ");

    const baseUrl = process.env.APP_BASE_URL || "localhost:3000";
    const kudosLink = `${baseUrl}/dashboard/org/${organizationId}/kudos/${createdKudo.id}`;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: allRecipientAddrs.join(", "),
      replyTo: sender.user.email,
      cc: sender.user.email,
      subject: `🎉 Kudos from ${sender.firstName} ${sender.lastName}`,
      text: `Hi ${recipientNames},\n\n${sender.firstName} sent you the following kudos:\n\n"${trimmedMessage}"\n\nView Kudos: ${kudosLink}\n\n– Crew Kudos Team`,
      html: `
        <p style="font-size: 14px;">Hi ${recipientNames},</p>
        <p style="font-size: 14px;"><strong>${sender.firstName} ${sender.lastName}</strong> sent you kudos:</p>
        <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; color: #333; font-size: 14px;">
          ${trimmedMessage}
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