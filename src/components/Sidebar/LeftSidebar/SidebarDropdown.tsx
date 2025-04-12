import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const SidebarDropdown = ({ item }: any) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const renderItem = (item: any, index: number) => {
    if (
      (item.label === "Admin" && session?.user.role !== "admin") ||
      (item.label !== "Admin" && item.label !== "Logout" && item.label === "Logout")
    ) {
      return null;
    }

    const isLogout = item.label === "Logout";
    const isActive = pathname === item.route;

    return (
      <li key={index}>
        <Link
          href={item.route}
          onClick={isLogout ? () => signOut() : undefined}
          className={`relative flex rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ease-in-out ${
            isActive
              ? "bg-white/10 text-white"
              : "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          {item.label}
          {item.pro && (
            <span className="absolute right-3 rounded-md bg-gradient-to-r from-red-500 to-yellow-500 px-1.5 py-0.5 text-xs font-medium text-white">
              Pro
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <ul className="mt-1 space-y-1 pl-9">
      {item.map((menuItem: any, index: number) => renderItem(menuItem, index))}
    </ul>
  );
};

export default SidebarDropdown;