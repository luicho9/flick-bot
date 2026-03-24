export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-12 px-8 py-24">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">
            Flick Bot
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Your movie companion on WhatsApp. Search, discover, and get ratings
            - all from a chat.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Commands
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                cmd: "/search <title>",
                desc: "Search for any movie by title",
              },
              {
                cmd: "/trending",
                desc: "See what's trending this week",
              },
              {
                cmd: "/details <id>",
                desc: "Full details — cast, director, ratings",
              },
              {
                cmd: "/recommend <id>",
                desc: "Get similar movie recommendations",
              },
            ].map((item) => (
              <div
                key={item.cmd}
                className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <code className="mb-1 text-sm font-medium text-black dark:text-zinc-100">
                  {item.cmd}
                </code>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm text-zinc-400 dark:text-zinc-500">
          <p>
            Powered by{" "}
            <a
              href="https://www.themoviedb.org/"
              className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              TMDB
            </a>
            ,{" "}
            <a
              href="https://chat-sdk.vercel.app"
              className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat SDK
            </a>{" "}
            & the{" "}
            <a
              href="https://github.com/luicho9/kapso-chat-sdk"
              className="underline hover:text-zinc-600 dark:hover:text-zinc-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kapso Chat SDK
            </a>{" "}
            community adapter.
          </p>
        </div>
      </main>
    </div>
  );
}
