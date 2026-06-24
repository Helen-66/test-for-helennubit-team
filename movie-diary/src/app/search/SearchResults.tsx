import { searchMovies } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Link from "next/link";

export default async function SearchResults({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const data = await searchMovies(query, page);

  if (data.results.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        没有找到与 &quot;{query}&quot; 相关的电影
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-4">
        找到 {data.total_results} 部相关电影
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {data.total_pages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          {page > 1 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              上一页
            </Link>
          )}
          <span className="px-4 py-2 text-gray-400">
            {page} / {data.total_pages}
          </span>
          {page < data.total_pages && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
            >
              下一页
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
