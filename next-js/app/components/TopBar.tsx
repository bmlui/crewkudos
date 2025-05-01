"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type Org = {
  id: string;
  name: string;
};

export default function TopBar() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [orgs, setOrgs] = useState<Org[]>([]);
  const [loading, setLoading] = useState(false);

  const email = user?.emailAddresses?.[0]?.emailAddress;

  // useEffect(() => {
  //   if (!email) return;

  //   const fetchOrgs = async () => {
  //     setLoading(true);
  //     try {
  //       const res = await fetch("/api/user/orgs");
  //       if (res.ok) {
  //         const data = await res.json();
  //         setOrgs(data);
  //       }
  //     } catch (err) {
  //       console.error("Failed to load orgs:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrgs();
  // }, [email]);

  const currentOrgId = pathname?.startsWith("/dashboard/org/")
    ? pathname.split("/dashboard/org/")[1].split("/")[0]
    : "";

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-4 sm:px-6 py-3 max-w-7xl mx-auto">
        {/* Logo / Title */}
        <div className="font-bold text-xl text-blue-600 cursor-pointer">
          <Link href="/dashboard" prefetch>
            Crew Kudos
          </Link>
        </div>

        {/* Action Bar */}
        <div className="flex flex-row items-center gap-2 sm:gap-4 w-auto">
          {isSignedIn && isLoaded ? (
            <>
              {/* Org Switcher
              <select
                className="border rounded px-2 py-1 text-sm text-gray-700 w-auto sm:block hidden"
                value={currentOrgId || ""}
                onChange={(e) => {
                  const selected = e.target.value;
                  if (!selected) return;
                  if (selected === "home") {
                    router.push("/dashboard");
                    return;
                  }
                  setTimeout(() => {
                    router.push(`/dashboard/org/${selected}`);
                  }, 10);
                }}
              >
                <option value="home">Select Org</option>
                {loading && <option disabled>Loading...</option>}
                {orgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select> */}

              {/* Email */}
              <span className="text-sm text-gray-700 break-words max-w-[200px] sm:max-w-none">
                {email || "Unknown User"}
              </span>

              {/* Logout */}
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Switch organization"
                    labelIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3 3h18v2H3V3zm0 7h12v2H3v-2zm0 7h18v2H3v-2z" />
                      </svg>
                    }
                    onClick={() => router.push("/dashboard")}
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </>
          ) : (
            <SignInButton>
              <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer w-auto">
                Log in
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}
