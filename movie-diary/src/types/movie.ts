export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface MovieDetail extends Omit<Movie, "genre_ids"> {
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface SearchResult {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface DiaryEntry {
  id: string;
  movieId: number;
  movieTitle: string;
  posterPath: string | null;
  rating: number;
  review: string;
  watchedDate: string;
  createdAt: string;
}
