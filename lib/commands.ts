import type { PostableMessage, ChatElement } from "chat";
import {
  searchMovies,
  getMovieDetails,
  getRecommendations,
  getTrending,
} from "./tmdb";
import { formatMovieList, formatDetails } from "./format";
import { resultsCard, detailsCard } from "./cards";

export type PostFn = (
  msg: string | PostableMessage | ChatElement,
) => Promise<unknown>;

export const HELP_TEXT = `
🎬 Here's what I can do:

🔍 */search <title>* — Search for a movie
🔥 */trending* — See what's trending this week
📖 */details <id>* — Get full movie details
🎯 */recommend <id>* — Get similar movies
❓ */help* — Show this message

Try it! Send */search Inception* to get started.`;

export async function handleCommand(text: string, post: PostFn): Promise<void> {
  const trimmed = text.trim();

  if (/^\/help$/i.test(trimmed)) {
    await post(HELP_TEXT);
    return;
  }

  if (/^\/help_search$/i.test(trimmed)) {
    await post(
      "🔍 To search, send:\n*/search <movie title>*\n\nExample: */search Inception*",
    );
    return;
  }

  if (/^\/trending$/i.test(trimmed)) {
    const movies = await getTrending();
    await post(`🔥 *Trending This Week*\n\n${formatMovieList(movies)}`);
    if (movies.length > 0) {
      await post({
        card: resultsCard(movies),
        fallbackText: "Tap a movie for details",
      });
    }
    return;
  }

  const searchMatch = trimmed.match(/^\/search\s+(.+)$/i);
  if (searchMatch) {
    const query = searchMatch[1];
    const movies = await searchMovies(query);
    if (movies.length === 0) {
      await post(`No results found for "${query}". Try a different title!`);
      return;
    }
    await post(`🔍 *Results for "${query}"*\n\n${formatMovieList(movies)}`);
    await post({
      card: resultsCard(movies),
      fallbackText: "Tap a movie for details",
    });
    return;
  }

  const detailsMatch = trimmed.match(/^\/details\s+(\d+)$/i);
  if (detailsMatch) {
    try {
      const movie = await getMovieDetails(Number(detailsMatch[1]));
      await post(formatDetails(movie));
      await post({ card: detailsCard(movie.id), fallbackText: "What next?" });
    } catch {
      await post("Movie not found. Check the ID and try again.");
    }
    return;
  }

  const recommendMatch = trimmed.match(/^\/recommend\s+(\d+)$/i);
  if (recommendMatch) {
    try {
      const id = Number(recommendMatch[1]);
      const source = await getMovieDetails(id);
      const movies = await getRecommendations(id);
      if (movies.length === 0) {
        await post(`No recommendations found for "${source.title}".`);
        return;
      }
      await post(
        `🎯 *If you liked "${source.title}", try:*\n\n${formatMovieList(movies)}`,
      );
      await post({
        card: resultsCard(movies),
        fallbackText: "Tap a movie for details",
      });
    } catch {
      await post("Movie not found. Check the ID and try again.");
    }
    return;
  }

  await post(
    `I didn't understand that. Send */help* to see available commands.`,
  );
}
