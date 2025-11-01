import { Sidebar } from "@/app/(main)/-components/side-bar";
import { SearchResults } from "@/app/api/search/search-results";
import { Metadata } from "next";

type SearchProps = {
  searchParams: {
    q: string;
  };
};

export function generateMetadata({
  searchParams: { q },
}: SearchProps): Metadata {
  return {
    title: `Search results for "${q}"`,
  };
}

export default function Search({ searchParams: { q } }: SearchProps) {
  return (
    <section className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm">
          <h1 className="line-clamp-2 text-center text-2xl font-bold break-all">
            Search results for &quot;{q}&quot;
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <Sidebar />
    </section>
  );
}
