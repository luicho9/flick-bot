import type { MovieResult, MovieDetails } from "./tmdb";

export function stars(rating: number): string {
  return `⭐ ${Math.round(rating * 10) / 10}/10`;
}

export function year(date: string): string {
  return date ? date.split("-")[0] : "TBA";
}

export function formatMovieList(movies: MovieResult[]): string {
  if (movies.length === 0) {
    return "No movies found.";
  }
  return movies
    .map(
      (m, i) =>
        `*${i + 1}. ${m.title}* (${year(m.release_date)})\n` +
        `${stars(m.vote_average)} · ${m.overview.slice(0, 100)}${m.overview.length > 100 ? "…" : ""}\n` +
        `📌 /details ${m.id}`,
    )
    .join("\n\n");
}

export function formatDetails(m: MovieDetails): string {
  const genres = m.genres.map((g) => g.name).join(", ");
  const director = m.credits?.crew.find((c) => c.job === "Director")?.name;
  const cast = m.credits?.cast
    .slice(0, 5)
    .map((c) => c.name)
    .join(", ");

  let text = `🎬 *${m.title}* (${year(m.release_date)})`;
  if (m.tagline) {
    text += `\n_"${m.tagline}"_`;
  }
  text += `\n\n${stars(m.vote_average)} (${m.vote_count.toLocaleString()} votes)`;
  text += `\n🎭 ${genres}`;
  if (m.runtime) {
    text += ` · ⏱ ${m.runtime} min`;
  }
  if (director) {
    text += `\n🎬 Director: ${director}`;
  }
  if (cast) {
    text += `\n🌟 Cast: ${cast}`;
  }
  text += `\n\n${m.overview}`;
  return text;
}
