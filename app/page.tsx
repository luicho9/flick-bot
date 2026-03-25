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
                cmd: "search <title>",
                desc: "Find a movie by title",
              },
              {
                cmd: "trending",
                desc: "What's hot this week",
              },
              {
                cmd: "best <year>",
                desc: "Top rated movies from a year",
              },
              {
                cmd: "genre <name>",
                desc: "Browse by genre or sub-genre",
              },
              {
                cmd: "details <id>",
                desc: "Full info, ratings, and streaming",
              },
              {
                cmd: "recommend <id>",
                desc: "Similar movie recommendations",
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
          <p>
            <a
              href="https://github.com/luicho9/flick-bot"
              className="inline-flex items-center gap-1.5 underline hover:text-zinc-600 dark:hover:text-zinc-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                height="16"
                strokeLinejoin="round"
                style={{ color: "currentColor" }}
                viewBox="0 0 16 16"
                width="16"
              >
                <title>GitHub</title>
                <g clipPath="url(#clip0_872_3147)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 0C3.58 0 0 3.57879 0 7.99729C0 11.5361 2.29 14.5251 5.47 15.5847C5.87 15.6547 6.02 15.4148 6.02 15.2049C6.02 15.0149 6.01 14.3851 6.01 13.7154C4 14.0852 3.48 13.2255 3.32 12.7757C3.23 12.5458 2.84 11.836 2.5 11.6461C2.22 11.4961 1.82 11.1262 2.49 11.1162C3.12 11.1062 3.57 11.696 3.72 11.936C4.44 13.1455 5.59 12.8057 6.05 12.5957C6.12 12.0759 6.33 11.726 6.56 11.5261C4.78 11.3262 2.92 10.6364 2.92 7.57743C2.92 6.70773 3.23 5.98797 3.74 5.42816C3.66 5.22823 3.38 4.40851 3.82 3.30888C3.82 3.30888 4.49 3.09895 6.02 4.1286C6.66 3.94866 7.34 3.85869 8.02 3.85869C8.7 3.85869 9.38 3.94866 10.02 4.1286C11.55 3.08895 12.22 3.30888 12.22 3.30888C12.66 4.40851 12.38 5.22823 12.3 5.42816C12.81 5.98797 13.12 6.69773 13.12 7.57743C13.12 10.6464 11.25 11.3262 9.47 11.5261C9.76 11.776 10.01 12.2558 10.01 13.0056C10.01 14.0752 10 14.9349 10 15.2049C10 15.4148 10.15 15.6647 10.55 15.5847C12.1381 15.0488 13.5182 14.0284 14.4958 12.6673C15.4735 11.3062 15.9996 9.67293 16 7.99729C16 3.57879 12.42 0 8 0Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_872_3147">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              View on GitHub
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
