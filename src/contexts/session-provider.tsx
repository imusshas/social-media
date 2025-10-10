"use client";

import { Session, User } from "lucia";
import { createContext, use } from "react";

type SessionContextProps = {
  user: User;
  session: Session;
};

const SessionContext = createContext<SessionContextProps | null>(null);

export function useSession() {
  const context = use(SessionContext);

  if (!context) {
    throw new Error("useSession must be used inside a SessionProvider");
  }

  return context;
}

export function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{
  value: SessionContextProps;
}>) {
  return <SessionContext value={value}>{children}</SessionContext>;
}
