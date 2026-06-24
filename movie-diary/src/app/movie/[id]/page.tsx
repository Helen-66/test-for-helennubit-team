import { getMovieDetail, getPosterUrl, getBackdropUrl, getProfileUrl } from "@/lib/tmdb";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToDiaryButton from "./AddToDiaryButton";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (isNaN(movieId)) notFound();

  let movie;
  try {
    movie = await getMovieDetail(movieId);
  } catch {
    notFound();
  }

  const directors =
    movie.credits?.crew.filter((c) => c.job === "Director") || [];
  const cast = movie.credits?.cast.slice(0, 10) || [];
  const year = movie.release_date ? movie.release_date.substring(0, 4) : "N/A";

  return (
    <div className="space-y-8">
      {movie.backdrop_path && (
        <div className="relative h-64 md:h-80 -mx-4 -mt-6 overflow-hidden">
          <Image
            src={getBackdropUrl(movie.backdrop_path)}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="shrink-0">
          <div className="relative w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-xl mx-auto md:mx-0">
            <Image
              src={getPosterUrl(movie.poster_path, "w500")}
              alt={movie.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
            {movie.original_title !== movie.title && (
              <p className="text-gray-400 mt-1">{movie.original_title}</p>
            )}
            {movie.tagline && (
              <p className="text-amber-400 text-sm mt-2 italic">{movie.tagline}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span>{year}</span>
            {movie.runtime && <span>{movie.runtime} 分钟</span>}
            <span className="flex items-center gap-1 text-amber-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {movie.vote_average.toFixed(1)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {movie.overview && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">剧情简介</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
          )}

          {directors.length > 0 && (
            <div>
              <span className="text-sm text-gray-400">导演：</span>
              <span className="text-sm text-white">
                {directors.map((d) => d.name).join(", ")}
              </span>
            </div>
          )}

          <AddToDiaryButton
            movieId={movie.id}
            movieTitle={movie.title}
            posterPath={movie.poster_path}
          />
        </div>
      </div>

      {cast.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">演员阵容</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {cast.map((member) => (
              <div key={member.id} className="text-center">
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-2">
                  <Image
                    src={getProfileUrl(member.profile_path)}
                    alt={member.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <p className="text-sm text-white truncate">{member.name}</p>
                <p className="text-xs text-gray-400 truncate">{member.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
