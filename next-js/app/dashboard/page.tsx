// app/dashboard/page.tsx
import { auth } from "@/auth";
import OrgList from "./components/OrgList";
import KudosList from "./components/KudosList";

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Unauthorized</h1>
        <p className="text-gray-500">
          You need to be logged in to access this page.
        </p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back 👋</h1>
        <p className="text-gray-600">
          Logged in as <strong>{session.user.email}</strong>
        </p>
      </div>
      <OrgList id={session.user.id || ""} />
      <KudosList id={session.user.id || ""} />
    </main>
  );
}
