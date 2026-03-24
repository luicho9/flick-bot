import { Chat } from "chat";
import { createKapsoAdapter } from "@luicho/kapso-chat-sdk";
import { getMovieDetails } from "./tmdb";
import { formatDetails } from "./format";
import { welcomeCard, detailsCard } from "./cards";
import { handleCommand, HELP_TEXT } from "./commands";
import { createRedisState } from "@chat-adapter/state-redis";

export const bot = new Chat({
  userName: "Flick Bot",
  adapters: {
    kapso: createKapsoAdapter(),
  },
  // Use MemoryStateAdapter for local dev without Redis:
  //   import { MemoryStateAdapter } from "@chat-adapter/state-memory";
  //   state: new MemoryStateAdapter(),
  state: createRedisState(),
});

bot.onDirectMessage(async (thread, message) => {
  await thread.subscribe();
  const text = message.text?.trim() ?? "";

  if (text && /^\//.test(text)) {
    await handleCommand(text, (msg) => thread.post(msg));
    return;
  }

  await thread.post(
    `👋 Hey there! I'm *Flick Bot*, your movie companion on WhatsApp.\n\n${HELP_TEXT}`,
  );
  await thread.post({ card: welcomeCard(), fallbackText: "Choose an option" });
});

bot.onSubscribedMessage(async (thread, message) => {
  const text = message.text?.trim() ?? "";
  if (!text) {
    return;
  }
  await handleCommand(text, (msg) => thread.post(msg));
});

bot.onAction("cmd", async (event) => {
  const value = event.value ?? "";
  const thread = event.thread;
  if (thread) {
    await handleCommand(value, (msg) => thread.post(msg));
  }
});

bot.onAction("movie", async (event) => {
  const movieId = Number(event.value);
  if (!movieId || !event.thread) {
    return;
  }
  try {
    const movie = await getMovieDetails(movieId);
    await event.thread.post(formatDetails(movie));
    await event.thread.post({
      card: detailsCard(movie.id),
      fallbackText: "What next?",
    });
  } catch {
    await event.thread.post("Movie not found.");
  }
});
