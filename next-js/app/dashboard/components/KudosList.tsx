import { getRecentKudosForUser } from "@/lib/kudos/getRecentKudosForUser";

export default async function KudosList({ email }: { email: string }) {
  const kudos = await getRecentKudosForUser(email);
  if (!kudos.length) {
    return (
      <section>
        <h2 className="text-xl font-semibold mb-3">
          Recent Kudos You Received
        </h2>
        <p className="text-gray-500 text-sm">
          You haven’t received any kudos yet.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Recent Kudos You Received</h2>
      <ul className="space-y-4">
        {kudos.map((kudo: any) => {
          const displayName = `${kudo.sender.firstName} ${kudo.sender.lastName}`;

          const departmentName = kudo.sender?.department?.name;

          return (
            <li key={kudo.id} className="bg-white p-4 rounded-lg shadow border">
              <div className="text-sm text-gray-500">
                From <strong>{displayName}</strong>
                {departmentName && (
                  <>
                    {" "}
                    (<span className="italic">{departmentName}</span>)
                  </>
                )}{" "}
                in <strong>{kudo.organization.name}</strong>
              </div>
              <div className="mt-1 whitespace-pre-line text-gray-800">
                {kudo.message}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(kudo.createdAt).toLocaleString()}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
