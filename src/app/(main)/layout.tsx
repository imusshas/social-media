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
      <Navbar />
      <main className="mx-auto flex flex-col px-2 sm:px-5 md:px-10 lg:px-20">
        {children}
      </main>
    </SessionProvider>
  );
}
