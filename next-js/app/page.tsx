"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AboutPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-black px-6 py-12 flex flex-col items-center">
      <div className="w-full max-w-4xl border-b-4 border-black pb-4 mb-8">
        <h1 className="text-5xl font-extrabold tracking-tight">
          About Crew Kudos 🚀
        </h1>
      </div>

      <div className="w-full max-w-4xl space-y-10">
        <section className="border-l-4 border-black pl-6">
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            What is Crew Kudos?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Crew Kudos is a recognition platform built for real teams. It’s
            designed to spotlight effort, reinforce positive behaviors, and
            build a culture of appreciation — one shoutout at a time. Whether
            you’re a lifeguard, camp counselor, or youth leader, Crew Kudos
            helps your team stay connected through genuine recognition.
            <br /> <br />
            Every kudos is instantly delivered to the recipient by email or
            text, making sure great work never goes unnoticed — and is
            celebrated in the moment it matters most.
          </p>
        </section>

        <section className="border-l-4 border-black pl-6">
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            Why we built it?
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We’ve trained hundreds of staff and saw one thing consistently:
            teams thrive when they are appreciated. But too often, recognition
            gets lost in the shuffle. Crew Kudos makes lifting up others simple,
            meaningful, and part of every day.
          </p>
        </section>

        <section className="border-l-4 border-black pl-6">
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            How does it work?
          </h2>
          <ul className="list-disc pl-4 text-gray-700 space-y-2">
            <li>Log in and select your organization.</li>
            <li>Write kudos to one or more teammates.</li>
            <li>Filter, view, and celebrate moments as a team.</li>
          </ul>
        </section>

        <section className="border-t-2 border-black pt-6">
          <p className="text-sm text-gray-500 italic">
            Built by BLUI for real teams. Designed with purpose.
          </p>
        </section>
      </div>

      <footer className="mt-16 text-xs text-gray-400 border-t pt-4 w-full max-w-4xl text-right">
        &copy; {new Date().getFullYear()} Crew Kudos by BLUI. All rights
        reserved.
      </footer>
    </main>
  );
}
