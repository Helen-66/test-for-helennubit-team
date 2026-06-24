import Link from "next/link";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { getPosterUrl } from "@/lib/tmdb";

export default function MovieCard({ movie }: { movie: Movie }) {
  const year = movie.release_date ? movie.release_date.substring(0, 4) : "N/A";

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group block rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-750 transition-all hover:scale-[1.02] hover:shadow-xl"
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={getPosterUrl(movie.poster_path, "w342")}
          alt={movie.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover group-hover:opacity-80 transition-opacity"
          unoptimized
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white truncate">{movie.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{year}</span>
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
