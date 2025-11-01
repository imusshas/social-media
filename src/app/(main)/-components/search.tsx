"use client";

import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

type SearchProps = {
  className?: string;
};

export function Search({ className }: SearchProps) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();

    if (!q) {
      return;
    }

    if (ref.current) {
      ref.current.value = "";
      ref.current.blur();
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} method="GET" action={"/search"}>
      <div className="relative">
        <input
          ref={ref}
          type="search"
          data-slot="input"
          name="q"
          id="search"
          className={cn(
            "dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-6 text-base shadow-xs transition-[color,box-shadow] outline-none",
            className,
          )}
          placeholder="Search here..."
        />
        <button
          type="submit"
          className="text-muted-foreground absolute top-1/2 right-1 -translate-y-1/2 transform cursor-pointer"
        >
          <SearchIcon className="size-5" />
        </button>
      </div>
    </form>
  );
}
