// app/dashboard/page.tsx
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OrgList from "./components/OrgList";
import KudosList from "./components/KudosList";

export default async function DashboardPage() {
  const { userId } = await auth();

  const user = await currentUser();

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back 👋</h1>
        <p className="text-gray-600">
          Logged in as{" "}
          <strong>{user?.emailAddresses?.[0]?.emailAddress}</strong>
        </p>
      </div>
      <OrgList email={user?.emailAddresses?.[0]?.emailAddress || ""} />
      <KudosList email={user?.emailAddresses?.[0]?.emailAddress || ""} />
    </main>
  );
}
