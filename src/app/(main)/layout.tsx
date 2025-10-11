import { Menubar } from "@/app/(main)/-components/menubar";
import { Navbar } from "@/app/(main)/-components/navbar";
import { validateRequest } from "@/auth";
import { SessionProvider } from "@/contexts/session-provider";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();
  if (!session.user) redirect("/login");
  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <section className="mx-auto flex w-full max-w-7xl grow">
          <Menubar className="bg-card sticky top-[4rem] hidden h-fit rounded-2xl px-3 py-5 shadow-sm sm:flex sm:flex-col sm:gap-3 lg:px-5 xl:w-80" />
          <main className="flex w-full grow flex-col px-2 sm:px-5">
            {children}
          </main>
        </section>
        <Menubar
          className="bg-card sticky bottom-0 flex w-full justify-center gap-5 border-t p-3 sm:hidden"
          asFooter
        />
      </div>
    </SessionProvider>
  );
}
