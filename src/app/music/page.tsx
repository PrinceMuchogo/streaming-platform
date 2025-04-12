"use client";

import FlexRightSidebar from "@/components/Sidebar/FlexRightSideBar";
import LeftBarLayout from "@/components/Layouts/LeftBarLayout";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import MusicFeedCard from "@/components/Music/MusicFeeCard";
import { mockSongs } from "@/mock/songs";
import type { Song } from "@/types/music";

export default function MusicPage() {
  const [songs, setSongs] = useState<Song[]>(mockSongs);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black">
      <div className="relative z-10">
        <LeftBarLayout>
          <div className="feed-container flex h-full min-h-screen flex-col items-center">
            {isLoading ? (
              <div className="grid w-full gap-8 p-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                  >
                    <div className="flex items-center space-x-4 p-4">
                      <div className="h-16 w-16 animate-pulse rounded-lg bg-white/5"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-3/4 rounded bg-white/5"></div>
                        <div className="h-3 w-1/2 rounded bg-white/5"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full min-h-screen w-full">
                <MusicFeedCard songs={songs} />
                <FlexRightSidebar />
              </div>
            )}
          </div>
        </LeftBarLayout>
      </div>
    </div>
  );
}