// watch_video/ [id]
"use client";
import LeftBarLayout from "@/components/Layouts/LeftBarLayout";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import "next-cloudinary/dist/cld-video-player.css";

import WatchVideo from "@/components/Video/WatchVideo";
import FlexRightSidebar from "@/components/Sidebar/FlexRightSideBar";

const Page = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000); // Simulate loading for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
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
            <WatchVideo id={id.toString()} />
            <FlexRightSidebar />
          </div>
        )}
      </div>
    </LeftBarLayout>
  );
};

export default Page;
