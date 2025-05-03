// app/dashboard/components/OrgList.tsx
import { getOrgsForUser } from "@/lib/orgs/getOrgsForUser";
import type { OrgsForUser } from "@/lib/orgs/getOrgsForUser";
import Link from "next/link";

type Props = {
  id: string;
};

export default async function OrgList({ id }: Props) {
  const user = await getOrgsForUser(id);

  if (!user || user.orgLinks.length === 0) {
    return (
      <section className="mb-10 ">
        <h2 className="text-xl font-semibold mb-3">Your Organizations</h2>
        <p className="text-gray-500 text-sm">You’re not in any orgs yet.</p>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-3">Your Organizations</h2>
      <ul className="space-y-2">
        {user.orgLinks.map((link: OrgsForUser["orgLinks"][number]) => (
          <li key={link.organization.id} className="">
            <Link
              href={`/dashboard/org/${link.organization.id}`}
              className="block bg-white p-4 rounded-lg shadow border cursor-pointer hover:shadow-lg hover:ring-1 transition-all duration-200"
            >
              <div className="font-medium">{link.organization.name}</div>
              <div className="text-sm text-gray-500">Role: {link.role}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
