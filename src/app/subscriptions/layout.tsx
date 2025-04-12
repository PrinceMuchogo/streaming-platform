"use client";
import { useSession } from "next-auth/react";
import NotLoggedIn from "@/components/ProtectedRoutes/NotLoggedIn";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  // const pathname = usePathname();

  if (!session) {
    return <NotLoggedIn />;
  }

  return <div className="h-full min-h-screen w-full">{children}</div>;
}
