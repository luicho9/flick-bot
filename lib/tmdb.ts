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
  return tmdbGet<MovieDetails>(`/movie/${id}?append_to_response=credits`);
}

export async function getRecommendations(id: number): Promise<MovieResult[]> {
  const data = await tmdbGet<{ results: MovieResult[] }>(
    `/movie/${id}/recommendations`,
  );
  return data.results.slice(0, 5);
}

export async function getTrending(): Promise<MovieResult[]> {
  const data = await tmdbGet<{ results: MovieResult[] }>(
    "/trending/movie/week",
  );
  return data.results.slice(0, 5);
}
