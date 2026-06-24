import { MovieDetail, SearchResult } from "@/types/movie";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error("TMDB_API_KEY environment variable is not set");
  }
  return key;
}

export async function searchMovies(
  query: string,
  page: number = 1,
  language: string = "zh-CN"
): Promise<SearchResult> {
  const params = new URLSearchParams({
    api_key: getApiKey(),
    query,
    page: String(page),
    language,
    include_adult: "false",
  });

  const res = await fetch(`${TMDB_BASE_URL}/search/movie?${params}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`TMDB search failed: ${res.status}`);
  }

  return res.json();
}

export async function getMovieDetail(
  id: number,
  language: string = "zh-CN"
): Promise<MovieDetail> {
  const params = new URLSearchParams({
    api_key: getApiKey(),
    language,
    append_to_response: "credits",
  });

  const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`TMDB movie detail failed: ${res.status}`);
  }

  return res.json();
}

export function getPosterUrl(
  path: string | null,
  size: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w342"
): string {
  if (!path) return "/no-poster.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: "w300" | "w780" | "w1280" | "original" = "w1280"
): string {
  if (!path) return "";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getProfileUrl(
  path: string | null,
  size: "w45" | "w185" | "h632" | "original" = "w185"
): string {
  if (!path) return "/no-avatar.svg";
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}
