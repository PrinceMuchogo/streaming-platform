"use client";

import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useStore from "@/zustand/videoStore";
import { videos } from "@/types/video";
import { Search, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SidebarProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (arg: boolean) => void;
}

const MobileRightSidebar = ({ mobileSidebarOpen, setMobileSidebarOpen }: SidebarProps) => {
  const { data: session, status } = useSession();
  const { videos } = useStore();
  const [filteredVideos, setFilteredVideos] = useState<videos[]>([]);
  const [videoID, setVideoID] = useState<string>("");
  const [videoName, setVideoName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const handleVideoSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVideoName(value);
    setVideoID("");
    const filtered = videos.filter((video) =>
      video.video_name!.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredVideos(filtered);
  };

  useEffect(() => {
    if (session) {
      const sessionExpiration = Math.floor(
        new Date(session.expires).getTime() / 1000
      );
      const now = Math.floor(new Date().getTime() / 1000);
      if (sessionExpiration < now) {
        signOut();
      }
    }
  }, [session]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setFilteredVideos(videos);
  }, [videos]);

  return (
    <ClickOutside onClick={() => setMobileSidebarOpen(false)}>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-full flex-col overflow-hidden bg-black/40 backdrop-blur-xl transition-transform duration-300 md:w-[320px] ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header with Search */}
        <div className="sticky top-0 z-10 border-b border-white/10 bg-black/60 px-4 py-4 backdrop-blur-lg">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Videos</h2>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="rounded-full bg-white/5 p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close Sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pl-10 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              onChange={handleVideoSearch}
              value={videoName}
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        {/* Videos List */}
        <div className="custom-scrollbar flex-1 overflow-y-auto">
          <div className="space-y-2 p-4">
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse space-x-3 rounded-lg border border-white/5 bg-white/5 p-2"
                >
                  <div className="h-16 w-28 flex-shrink-0 rounded-md bg-white/10"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 w-3/4 rounded bg-white/10"></div>
                    <div className="h-3 w-1/2 rounded bg-white/10"></div>
                  </div>
                </div>
              ))
            ) : filteredVideos && filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <Link key={video.id} href={`/play/watch_video/${video.id}`}>
                  <div className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5 p-2 transition-all hover:border-red-500/30 hover:bg-white/10">
                    <div className="flex space-x-3">
                      {/* Thumbnail */}
                      <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src="/images/codered.jpg"
                          alt={`Thumbnail of ${video.video_name}`}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>

                      {/* Video Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="line-clamp-2 text-sm font-medium text-white group-hover:text-red-400">
                          {video.video_name}
                        </h3>
                        <div className="mt-1 flex items-center space-x-2 text-xs text-gray-400">
                          <span className="truncate">
                            {video?.views! > 1
                              ? video.views + " views"
                              : video.views + " view"}
                          </span>
                          <span>•</span>
                          <span className="truncate">
                            {video.createdAt
                              ? formatDistanceToNow(new Date(video.createdAt), {
                                  addSuffix: true,
                                })
                              : "No date available"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-yellow-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-white/5 p-4">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <div className="max-w-[240px] space-y-2">
                  <h3 className="text-sm font-medium text-white">No videos found</h3>
                  <p className="text-xs text-gray-400">
                    Try searching for something else or check back later for new content
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 bg-black/40 px-4 py-3 backdrop-blur-sm">
          <p className="text-center text-xs text-gray-400">
            Powered by{" "}
            <a
              href="https://x.com/genZtechlabszw"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-red-500 hover:text-red-400"
            >
              GenzTechLabs
            </a>
          </p>
        </div>

        {/* Custom Scrollbar Styles */}
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 2px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}</style>
      </aside>
    </ClickOutside>
  );
};

export default MobileRightSidebar;