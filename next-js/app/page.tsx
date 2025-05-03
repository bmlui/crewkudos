export default function AboutPage() {
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
            Crew Kudos is a recognition platform built for high-performing
            teams. It’s designed to spotlight effort, reinforce behavior, and
            build a culture of appreciation — one shout-out at a time. Whether
            you’re a lifeguard, camp counselor, or youth leader, Crew Kudos
            helps your team stay connected through genuine recognition.
          </p>
          <p className="text-gray-700 leading-relaxed mt-2">
            Every kudos is instantly delivered to the recipient by email or
            text, making sure great work never goes unnoticed — and is
            celebrated in the moment it matters most.
          </p>
        </section>

        <section className="border-l-4 border-black pl-6">
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            Why we built it?
          </h2>
          <span className="text-gray-700 leading-relaxed flex flex-col space-y-2">
            <p>
              We built Crew Kudos because the best teams don’t just run on rules
              — they run on recognition.
            </p>
            <p>
              Too often, the hard work, initiative, and character that keep
              things moving go unnoticed. We saw it in lifeguard teams, youth
              programs, and frontline roles: people showing up, giving their
              best, and rarely hearing “you made a difference.”
            </p>
            <p>
              We knew there had to be a better way to reinforce what matters —
              not through points or gimmicks, but through real, human
              appreciation.
            </p>
            <p>
              Crew Kudos is a system built for culture. It’s simple, fast, and
              designed to fit into the rhythm of real work — not disrupt it.
            </p>
          </span>
          <section className="bg-white text-center py-8 px-6">
            <h2 className="text-xl font-semibold text-gray-900 max-w-2xl mx-auto">
              “You do not rise to the level of your goals. You fall to the level
              of your systems.”
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              — James Clear, <em>Atomic Habits</em>
            </p>
          </section>
        </section>

        <section className="border-l-4 border-black pl-6">
          <h2 className="text-2xl font-bold mb-2 text-red-600">
            How does it work?
          </h2>
          <ol className="list-disc pl-4 text-gray-700 space-y-2">
            <li>Log in and select your organization.</li>
            <li>Write kudos to one or more teammates.</li>
            <li>Filter, view, and celebrate moments as a team.</li>
          </ol>
        </section>

        <section className="border-t-2 border-black pt-6">
          <p className="text-sm text-gray-500 italic">
            Built by BLUI for real teams. Many small moments. One strong
            culture.
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
