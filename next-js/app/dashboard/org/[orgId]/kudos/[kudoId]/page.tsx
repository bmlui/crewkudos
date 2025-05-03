import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function KudosPage({
  params,
}: {
  params: Promise<{ orgId: string; kudoId: string }>;
}) {
  const { orgId, kudoId } = await params;

  const kudo = await getKudo(kudoId);

  if (!kudo || kudo.organizationId !== orgId) {
    return notFound();
  }
  type KudoUniq = NonNullable<Awaited<ReturnType<typeof getKudo>>>;

  return (
    <div className="mt-6 max-w-3xl mx-auto px-4">
      <Link
        href={`/dashboard/org/${orgId}`}
        className="text-blue-600 text-sm underline hover:text-blue-800 block mb-4"
      >
        ← Back to Organization
      </Link>

      <ul className="space-y-4">
        <li className="bg-white rounded-lg shadow border p-4">
          <div className="text-md text-black font-black">
            {kudo.recipients.map(
              (recipient: KudoUniq["recipients"][number], index: number) => {
                const r = recipient.userOnOrg;
                return (
                  <span key={recipient.id}>
                    <strong>
                      {r.firstName} {r.lastName}
                    </strong>{" "}
                    <span className="italic">
                      ({r.department?.name || "No Department"})
                    </span>
                    {index < kudo.recipients.length - 1 && ", "}
                  </span>
                );
              }
            )}
          </div>

          <div className="text-sm text-gray-600">
            From{" "}
            <strong>
              {kudo.sender.firstName} {kudo.sender.lastName}
            </strong>{" "}
            <span className="italic">
              ({kudo.sender.department?.name || "No Department"})
            </span>
          </div>

          <p className="mt-1 whitespace-pre-line">{kudo.message}</p>

          <p className="text-xs text-gray-400 mt-2">
            {(() => {
              const createdAt = new Date(kudo.createdAt);
              const now = new Date();
              const diff = Math.floor(
                (now.getTime() - createdAt.getTime()) / 1000
              );
              if (diff < 60) return "Just now";
              if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
              if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
              return createdAt.toLocaleString();
            })()}
          </p>
        </li>
      </ul>
    </div>
  );
}

async function getKudo(kudoId: string) {
  return await prisma.kudos.findUnique({
    where: { id: kudoId },
    include: {
      organization: true,
      sender: {
        include: {
          department: true,
        },
      },
      recipients: {
        include: {
          userOnOrg: {
            include: {
              department: true,
            },
          },
        },
      },
    },
  });
}
