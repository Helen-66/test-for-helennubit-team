import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
          <span className="text-2xl">🎬</span>
          <span>电影日记</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/search"
            className="text-gray-300 hover:text-amber-400 transition-colors text-sm"
          >
            搜索
          </Link>
        </nav>
      </div>
    </header>
  );
}
