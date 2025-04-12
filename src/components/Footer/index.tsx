import Link from "next/link";
import React from "react";
import {
  FaHome,
  FaSearch,
  FaBookmark,
  FaUser,
  FaDollarSign,
} from "react-icons/fa";

interface FooterProps {
  onSearchClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onSearchClick }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0  md:hidden">
      {/* Glassmorphic Background */}
      <div className="relative border-t border-white/10 bg-black/40 backdrop-blur-xl">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>

        {/* Navigation Items */}
        <nav className="relative flex items-center justify-around">
          <Link
            href="/subscriptions"
            className="group flex flex-col items-center gap-1 transition-transform hover:scale-110"
            aria-label="Home"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/10 blur-sm transition-opacity group-hover:opacity-100 opacity-0"></div>
              <FaDollarSign size={24} className="relative text-white transition-colors group-hover:text-red-500" />
            </div>
          </Link>

          <button
            onClick={onSearchClick}
            className="group flex flex-col items-center gap-1 transition-transform hover:scale-110"
            aria-label="Search"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-500/10 blur-sm transition-opacity group-hover:opacity-100 opacity-0"></div>
              <FaSearch size={24} className="relative text-white transition-colors group-hover:text-yellow-500" />
            </div>
          </button>

          <Link
            href="/play/home"
            className="group relative flex flex-col items-center gap-1"
            aria-label="New Post"
          >
            <div className="relative flex h-14 w-14  items-center justify-center">
              <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-tr from-red-500 to-yellow-500 blur-sm"></div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-black transition-transform group-hover:scale-110">
                <FaHome size={24} className=" text-white transition-colors group-hover:text-red-500" />
              </div>
            </div>
          </Link>

          <Link
            href="/play/fav"
            className="group flex flex-col items-center gap-1 transition-transform hover:scale-110"
            aria-label="Favorites"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-red-500/10 blur-sm transition-opacity group-hover:opacity-100 opacity-0"></div>
              <FaBookmark size={24} className="relative text-white transition-colors group-hover:text-red-500" />
            </div>
          </Link>

          <Link
            href="/profile"
            className="group flex flex-col items-center gap-1 transition-transform hover:scale-110"
            aria-label="Profile"
          >
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-500/10 blur-sm transition-opacity group-hover:opacity-100 opacity-0"></div>
              <FaUser size={24} className="relative text-white transition-colors group-hover:text-yellow-500" />
            </div>
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;