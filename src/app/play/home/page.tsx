"use client";

import FlexRightSidebar from "@/components/Sidebar/FlexRightSideBar";
import LeftBarLayout from "@/components/Layouts/LeftBarLayout";
import React from "react";
import { useEffect, useState } from "react";
import { videos } from "@/types/video";
import FeedCard from "@/components/FeedCard";
import useStore from "@/zustand/videoStore";
import useUserStore from "@/zustand/userStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [video_data, set_video_data] = useState<videos | any>([]);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const { setUserInfo } = useUserStore();
  const { setVideos } = useStore();
  const router = useRouter();

  useEffect(() => {
    setUserInfo(session?.user!);
    const fetchVideos = async () => {
      const response = await fetch(`/api/get-videos/${session?.user.id}`, {
        method: "GET",
      });
      const data = await response.json();
      set_video_data(data);
      setVideos(data);
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-black">
      {/* Dynamic Background */}
      {/* <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-red-950/30"></div>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay"></div>
      </div> */}

      {/* Animated Shapes */}
      {/* <div className="absolute inset-0 overflow-hidden">
         <div className="absolute -left-1/3 top-1/4 h-[300px] w-[300px] animate-pulse rounded-full bg-red-500/10 blur-3xl sm:h-[500px] sm:w-[500px]"></div>
        <div className="absolute -right-1/3 top-3/4 h-[300px] w-[300px] animate-pulse rounded-full bg-yellow-500/10 blur-3xl sm:h-[500px] sm:w-[500px]"></div> 
      </div> */}

      <div className="relative z-10">
        <LeftBarLayout>
          <div className="feed-container flex h-full min-h-screen flex-col items-center">
            {isLoading ? (
              <div className="grid w-full gap-8 p-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    // className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl"
                    className="overflow-hidden rounded-2xl border border-white/10 bg-black/40"
                  >
                    <div className="aspect-video animate-pulse bg-white/5"></div>
                    <div className="space-y-4 p-4">
                      <div className="h-4 w-3/4 rounded bg-white/5"></div>
                      <div className="h-3 w-1/2 rounded bg-white/5"></div>
                      <div className="h-3 w-1/3 rounded bg-white/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full min-h-screen w-full">
                {<FeedCard videos={video_data} />}
                <FlexRightSidebar />
              </div>
            )}
          </div>
        </LeftBarLayout>
      </div>
    </div>
  );
}
