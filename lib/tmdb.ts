const BASE_URL = "https://api.themoviedb.org/3";

function headers(): HeadersInit {
  const token = process.env.TMDB_API_ACCESS_TOKEN;
  if (!token) {
    throw new Error("TMDB_API_ACCESS_TOKEN is not set");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export interface MovieResult {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  genre_ids?: number[];
}

export interface MovieDetails {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  genres: { id: number; name: string }[];
  credits?: {
    cast: { name: string; character: string; order: number }[];
    crew: { name: string; job: string }[];
  };
  external_ids?: {
    imdb_id: string | null;
  };
}

async function tmdbGet<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, { headers: headers() });
  if (!res.ok) {
    throw new Error(`TMDB ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function searchMovies(query: string): Promise<MovieResult[]> {
  const data = await tmdbGet<{ results: MovieResult[] }>(
    `/search/movie?query=${encodeURIComponent(query)}&include_adult=false`,
  );
  return data.results.slice(0, 5);
}

export async function getMovieDetails(id: number): Promise<MovieDetails> {
  return tmdbGet<MovieDetails>(
    `/movie/${id}?append_to_response=credits,external_ids`,
  );
}

export async function getRecommendations(id: number): Promise<MovieResult[]> {
  const data = await tmdbGet<{ results: MovieResult[] }>(
    `/movie/${id}/recommendations`,
  );
  return data.results.slice(0, 5);
}

interface WatchProvider {
  provider_name: string;
}

interface WatchRegion {
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

export interface WatchProviders {
  stream: string[];
}

export async function getWatchProviders(
  id: number,
  region = "US",
): Promise<WatchProviders> {
  const data = await tmdbGet<{ results: Record<string, WatchRegion> }>(
    `/movie/${id}/watch/providers`,
  );
  const providers = data.results[region];
  if (!providers) {
    return { stream: [] };
  }
  return {
    stream: providers.flatrate?.map((p) => p.provider_name) ?? [],
  };
}

export async function getTrending(): Promise<MovieResult[]> {
  const data = await tmdbGet<{ results: MovieResult[] }>(
    "/trending/movie/week",
  );
  return data.results.slice(0, 5);
}

const GENRES: Record<string, number> = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

const SUBGENRES: Record<string, number> = {
  "rom-com": 9799,
  "romcom": 9799,
  heist: 10051,
  slasher: 12339,
  zombie: 12377,
  superhero: 9715,
};

export type GenreMatch =
  | { type: "genre"; id: number; name: string }
  | { type: "keyword"; id: number; name: string }
  | null;

export function resolveGenre(input: string): GenreMatch {
  const key = input.toLowerCase().trim();
  if (SUBGENRES[key]) {
    return { type: "keyword", id: SUBGENRES[key], name: input };
  }
  if (GENRES[key]) {
    return { type: "genre", id: GENRES[key], name: input };
  }
  return null;
}

export const GENRE_NAMES = Object.keys(GENRES);

export interface DiscoverOptions {
  year?: number;
  genreId?: number;
  keywordId?: number;
}

export async function discoverMovies(
  options: DiscoverOptions,
): Promise<MovieResult[]> {
  const params = new URLSearchParams({
    sort_by: "vote_average.desc",
    "vote_count.gte": "200",
    include_adult: "false",
  });
  if (options.year) {
    params.set("primary_release_year", String(options.year));
  }
  if (options.genreId) {
    params.set("with_genres", String(options.genreId));
  }
  if (options.keywordId) {
    params.set("with_keywords", String(options.keywordId));
  }
  const data = await tmdbGet<{ results: MovieResult[] }>(
    `/discover/movie?${params}`,
  );
  return data.results.slice(0, 5);
}
