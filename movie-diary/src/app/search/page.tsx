import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "./SearchResults";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1", 10);

  return (
    <div className="space-y-6">
      <SearchBar initialQuery={query} />
      {query ? (
        <Suspense
          fallback={
            <div className="text-center py-12 text-gray-400">搜索中...</div>
          }
        >
          <SearchResults query={query} page={page} />
        </Suspense>
      ) : (
        <div className="text-center py-12 text-gray-400">输入关键词搜索电影</div>
      )}
    </div>
  );
}
