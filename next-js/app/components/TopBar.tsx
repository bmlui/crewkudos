"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function TopBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const isSignedIn = status === "authenticated";
  const email = session?.user?.email;
  const showDashboardButton = isSignedIn && pathname === "/";

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50 w-full">
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-y-2 px-4 py-2 max-w-7xl mx-auto text-sm">
        {/* Logo */}
        <Link
          href={isSignedIn ? "/dashboard" : "/"}
          className="font-semibold  text-blue-600 text-lg sm:text-xl"
        >
          Crew Kudos
        </Link>

        {/* Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 justify-end max-w-full">
          {showDashboardButton && (
            <button className="">
              <Link
                className="block cursor-pointer  px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </button>
          )}

          {isSignedIn ? (
            <>
              <span className="text-gray-700 text-sm">
                {typeof email === "string" && (
                  <>
                    {/* Mobile: short version with truncation */}
                    <span className="block sm:hidden truncate max-w-[150px]">
                      {email.split("@")[0]}@...
                    </span>

                    {/* Desktop: full version */}
                    <span className="hidden sm:inline">{email}</span>
                  </>
                )}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="cursor-pointer px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Log out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("email", { callbackUrl: "/dashboard" })}
              className="cursor-pointer  px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Log in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
