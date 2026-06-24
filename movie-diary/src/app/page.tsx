import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-amber-400">电影</span>日记
        </h1>
        <p className="text-gray-400 text-lg">搜索电影，记录你的观影旅程</p>
      </div>
      <SearchBar />
    </div>
  );
}
