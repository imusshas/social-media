import { Search } from "@/app/(main)/-components/search";
import { UserButton } from "@/app/(main)/-components/user-button";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="bg-card sticky top-0 z-10 flex flex-wrap items-center justify-center gap-5 border-b px-2 py-2.5 sm:px-5 md:px-10 lg:px-20">
      <Link
        href={"/"}
        className="text-primary text-xl font-bold sm:text-2xl lg:text-3xl"
      >
        Social Media
      </Link>
      <Search />
      <UserButton className="sm:ml-auto" />
    </header>
  );
}
