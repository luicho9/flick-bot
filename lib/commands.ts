import type { PostableMessage, ChatElement } from "chat";
import {
  searchMovies,
  getMovieDetails,
  getRecommendations,
  getTrending,
  getWatchProviders,
  discoverMovies,
  resolveGenre,
  GENRE_NAMES,
} from "./tmdb";
import { getOmdbRatings } from "./omdb";
import { formatMovieList, formatDetails } from "./format";
import { resultsCard, detailsCard, genreCard } from "./cards";

export type PostFn = (
  msg: string | PostableMessage | ChatElement,
) => Promise<unknown>;

export const HELP_TEXT = `🎬 Here's what I can do:

🔍 */search <title>* — Search for a movie
🔥 */trending* — See what's trending this week
🏆 */best <year>* — Top rated movies from a year
🎭 */genre <name>* — Browse by genre or sub-genre
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
      await post(`No results for "${query}".`);
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
      const [omdb, wp] = await Promise.all([
        movie.external_ids?.imdb_id
          ? getOmdbRatings(movie.external_ids.imdb_id)
          : null,
        getWatchProviders(movie.id),
      ]);
      await post(formatDetails(movie, omdb, wp));
      await post({ card: detailsCard(movie.id), fallbackText: "What next?" });
    } catch {
      await post("Movie not found.");
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
      await post("Movie not found.");
    }
    return;
  }

  const bestMatch = trimmed.match(/^\/best\s+(\d{4})$/i);
  if (bestMatch) {
    const year = Number(bestMatch[1]);
    const movies = await discoverMovies({ year });
    if (movies.length === 0) {
      await post(`No top-rated movies found for ${year}.`);
      return;
    }
    await post(`🏆 *Best of ${year}*\n\n${formatMovieList(movies)}`);
    await post({
      card: resultsCard(movies),
      fallbackText: "Tap a movie for details",
    });
    return;
  }

  const genreMatch = trimmed.match(/^\/genre(?:\s+(.+))?$/i);
  if (genreMatch) {
    const args = genreMatch[1]?.trim();

    if (!args) {
      await post(
        `🎭 *Available Genres*\n\n${GENRE_NAMES.join(", ")}\n\n*Sub-genres:* rom-com, heist, slasher, zombie, superhero\n\nUse */genre name* or */genre name year*`,
      );
      await post({ card: genreCard(), fallbackText: "Pick a genre" });
      return;
    }

    const parts = args.split(/\s+/);
    const lastPart = parts[parts.length - 1];
    const hasYear = /^\d{4}$/.test(lastPart);
    const genreName = hasYear ? parts.slice(0, -1).join(" ") : args;
    const year = hasYear ? Number(lastPart) : undefined;

    const match = resolveGenre(genreName);
    if (!match) {
      await post(
        `Unknown genre "${genreName}". Try */genre* for options.`,
      );
      return;
    }

    const options =
      match.type === "genre"
        ? { genreId: match.id, year }
        : { keywordId: match.id, year };

    const movies = await discoverMovies(options);
    if (movies.length === 0) {
      const label = year ? `${genreName} (${year})` : genreName;
      await post(`No movies found for "${label}".`);
      return;
    }

    const header = year
      ? `🎭 *Best ${genreName} movies of ${year}*`
      : `🎭 *Top ${genreName} movies*`;

    await post(`${header}\n\n${formatMovieList(movies)}`);
    await post({
      card: resultsCard(movies),
      fallbackText: "Tap a movie for details",
    });
    return;
  }

  await post(
    `Try */help* for commands.`,
  );
}
