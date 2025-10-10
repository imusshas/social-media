import { LoginForm } from "@/app/(auth)/login/login-form";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="bg-card w-full max-w-lg space-y-1 overflow-hidden rounded-2xl p-6 text-center">
        <div className="gap-1 text-2xl sm:text-3xl md:text-4xl">
          Login to
          <h1 className="text-primary inline pl-1 font-semibold">
            Social Media
          </h1>
        </div>
        <p className="text-muted-foreground">
          A place to connect with <span className="italic">friends</span>
        </p>
        <LoginForm />
        <p>
          Do not have an account?{" "}
          <Link href="/signup" replace className="text-muted-foreground">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
