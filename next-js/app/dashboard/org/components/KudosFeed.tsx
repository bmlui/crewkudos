"use client";

import { useEffect, useState } from "react";

export default function KudosFeed({
  orgId,
  defaultDeptId,
  defaultDeptName = "My Department",
}: {
  orgId: string;
  defaultDeptId?: string;
  defaultDeptName?: string;
}) {
  const [kudos, setKudos] = useState<any[]>([]);
  const [departments, setDepartments] = useState<
    { id: string; name: string }[]
  >([]);
  const [departmentsLoaded, setDepartmentsLoaded] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [department, setDepartment] = useState<string | undefined>(
    defaultDeptId
  );
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const take = 5;

  // Initial setup
  useEffect(() => {
    setKudos([]);
    setPage(0);
    setHasMore(true);
    setIsReady(true);
  }, [defaultDeptId]);

  // Load kudos
  useEffect(() => {
    if (!isReady) return;

    const load = async () => {
      const params = new URLSearchParams({
        take: String(take),
        skip: String(page * take),
      });
      if (department) params.set("departmentId", department);

      const res = await fetch(`/api/org/${orgId}/kudos?` + params.toString());
      const data = await res.json();

      setHasMore(data.length === take);

      setKudos((prev) => {
        const existingIds = new Set(prev.map((k) => k.id));
        const newKudos = data.filter((k: any) => !existingIds.has(k.id));
        return [...prev, ...newKudos];
      });
    };

    load();
  }, [page, department, isReady]);

  // Lazy load departments
  const loadDepartments = async () => {
    if (departmentsLoaded || loadingDepartments) return;
    setLoadingDepartments(true);
    try {
      const res = await fetch(`/api/org/${orgId}/departments`);
      const data = await res.json();
      setDepartments(data);
      setDepartmentsLoaded(true);
    } catch (err) {
      console.error("Failed to load departments", err);
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Label for current department
  const selectedDeptName =
    department === undefined
      ? "All Departments"
      : departmentsLoaded
      ? departments.find((d) => d.id === department)?.name ?? defaultDeptName
      : defaultDeptName;

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium mb-2">
        Filtering by: <strong>{selectedDeptName}</strong>
      </label>

      <select
        value={department ?? "__ALL__"}
        onFocus={loadDepartments}
        onClick={loadDepartments}
        onChange={(e) => {
          const value =
            e.target.value === "__ALL__" ? undefined : e.target.value;
          if (value === department) return; // No change
          setDepartment(undefined); // Force refresh
          setTimeout(() => {
            setDepartment(value);
            setKudos([]);
            setPage(0);
            setHasMore(true);
          }, 0);
        }}
        className="border px-2 py-1 mb-4"
      >
        <option disabled>Select a department</option>
        {departmentsLoaded && <option value="__ALL__">All Departments</option>}

        {loadingDepartments && !departmentsLoaded && (
          <option disabled>Loading departments...</option>
        )}
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>

      <ul className="space-y-4">
        {kudos.map((kudo) => (
          <li key={kudo.id} className="bg-white rounded-lg shadow border p-4">
            <div className="text-md text-black font-black">
              {kudo.recipients.map((recipient: any, index: number) => {
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
              })}
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
            <p className="text-xs text-gray-400">
              {(() => {
                const createdAt = new Date(kudo.createdAt);
                const now = new Date();
                const diff = Math.floor(
                  (now.getTime() - createdAt.getTime()) / 1000
                );
                if (diff < 60) return "Just now";
                if (diff < 3600)
                  return `${Math.floor(diff / 60)} minute(s) ago`;
                if (diff < 86400)
                  return `${Math.floor(diff / 3600)} hour(s) ago`;
                return createdAt.toLocaleString();
              })()}
            </p>
          </li>
        ))}
      </ul>

      {hasMore ? (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600"
        >
          Load More
        </button>
      ) : (
        <p className="mt-6 text-center text-sm text-gray-500">
          🎉 You’ve reached the end!
        </p>
      )}
    </div>
  );
}
