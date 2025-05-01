"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition hover:cursor-pointer"
      >
        Back to Home
      </button>
    </main>
  );
}
