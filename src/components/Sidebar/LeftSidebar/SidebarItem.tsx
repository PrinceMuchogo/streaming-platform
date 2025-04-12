import React from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarDropdown from "./SidebarDropdown";
import { useSession } from "next-auth/react";

const SidebarItem = ({ item, pageName, setPageName, setSidebarOpen, sidebarOpen }: any) => {
  const { data: session } = useSession();
  
  const handleClick = () => {
    const updatedPageName = pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    if (item.label === "Search") {
      setSidebarOpen(!sidebarOpen);
    }
    return setPageName(updatedPageName);
  };

  const isActive = pageName === item.label.toLowerCase();

  return (
    <li>
      <Link
        href={item.route}
        onClick={handleClick}
        className={`group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out ${
          isActive
            ? "bg-white/10 text-white"
            : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
      >
        {item.label === "Profile" ? (
          <span className="relative block h-8 w-8 overflow-hidden rounded-full">
            {session?.user?.profile_image_url ? (
              <Image
                src={session.user.profile_image_url}
                width={32}
                height={32}
                alt="User"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full animate-pulse items-center justify-center bg-white/10"></span>
            )}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-black bg-green-500"></span>
          </span>
        ) : (
          <span className="text-lg">{item.icon}</span>
        )}
        
        <span>{item.label}</span>
        
        {item.message && (
          <span className="absolute right-3 rounded-full bg-red-500/10 px-1.5 py-0.5 text-xs font-medium text-red-500">
            {item.message}
          </span>
        )}
        
        {item.pro && (
          <span className="absolute right-3 rounded-md bg-gradient-to-r from-red-500 to-yellow-500 px-1.5 py-0.5 text-xs font-medium text-white">
            Pro
          </span>
        )}
        
        {item.children && (
          <svg
            className={`absolute right-3 h-4 w-4 transition-transform ${
              isActive ? "rotate-180 text-white" : "text-gray-400"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </Link>

      {item.children && (
        <div className={`overflow-hidden transition-all ${isActive ? "max-h-96" : "max-h-0"}`}>
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;