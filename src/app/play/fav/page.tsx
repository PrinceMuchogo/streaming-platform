"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import FlexRightSidebar from "@/components/Sidebar/FlexRightSideBar";
import LeftBarLayout from "@/components/Layouts/LeftBarLayout";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { videos } from "@/types/video";
import useUserStore from "@/zustand/userStore";
import { useSession } from "next-auth/react";
import FavouriteVideoFeedCard from "@/components/FavVideoCard";
import { favouriteVideo } from "@/types/favouriteVideo";

export default function Home() {
  const [video_data, set_video_data] = useState<videos | any>([]);
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { userInfo } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      // const response = await fetch(`/api/user/fav-videos/${userInfo?.id}`, {
      //   method: "GET",
      // });
      // const data: favouriteVideo[] = await response.json();
      set_video_data([]);
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => setIsLoading(false), 3000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);

  // if(!session){
  //   router.push("/auth/signin");
  // }

  return (
    <div className="dark bg-black">
      <LeftBarLayout>
        <div className="feed-container flex flex-col items-center bg-black">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex h-screen min-h-screen w-full flex-grow animate-pulse flex-col bg-black"
              >
                <div className="h-[60%] w-full bg-gray-700"></div>
                <div className="flex flex-col space-y-2 px-4 py-2 text-white">
                  <div className="h-4 w-3/4 rounded bg-gray-600"></div>
                  <div className="h-3 w-1/2 rounded bg-gray-600"></div>
                  <div className="h-3 w-1/3 rounded bg-gray-500"></div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full min-h-screen w-full">
              {<FavouriteVideoFeedCard videos={video_data} />}
              <FlexRightSidebar />
            </div>
          )}
        </div>
      </LeftBarLayout>
    </div>
  );
}
