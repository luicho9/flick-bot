const BASE_URL = "http://www.omdbapi.com";
const OMDB_API_KEY = process.env.OMDB_API_KEY;

export interface OmdbRatings {
  imdb?: string;
  rottenTomatoes?: string;
  metascore?: string;
}

export async function getOmdbRatings(
  imdbId: string,
): Promise<OmdbRatings | null> {
  if (!OMDB_API_KEY) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/?apikey=${OMDB_API_KEY}&i=${imdbId}`);
  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as {
    Response: string;
    imdbRating?: string;
    Metascore?: string;
    Ratings?: { Source: string; Value: string }[];
  };

  if (data.Response !== "True") {
    return null;
  }

  const rt = data.Ratings?.find((r) => r.Source === "Rotten Tomatoes");

  return {
    imdb: data.imdbRating !== "N/A" ? data.imdbRating : undefined,
    rottenTomatoes: rt?.Value,
    metascore: data.Metascore !== "N/A" ? data.Metascore : undefined,
  };
}
