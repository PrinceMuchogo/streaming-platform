//Right sidebar

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "@/components/ClickOutside";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { videos } from "@/types/video";
import { formatDistanceToNow } from "date-fns";

const RightSidebar = () => {
  const pathname = usePathname();

  const { data: session, status } = useSession();

  const [videoID, setVideoID] = useState<string>("");
  const [videoName, setVideoName] = useState<string>("");
  const [videos, set_video_data] = useState<videos | any>([]);
  const [filteredVideos, setFilteredVideos] = useState(videos);
  const [isLoading, setIsLoading] = useState(true);

  const handleVideoSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("this is the big screen right sidebar")
    const value = e.target.value;
    setVideoName(value);
    setVideoID("");
    const filtered = videos.filter((video: videos) =>
      video.video_name!.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredVideos(filtered);
  };

  useEffect(() => {
    if (session) {
      const sessionExpiration = Math.floor(
        new Date(session.expires).getTime() / 1000,
      );
      const now = Math.floor(new Date().getTime() / 1000);

      // Redirect or sign out the user if the session is expired
      if (sessionExpiration < now) {
        signOut();
      } else {
      }
    }
  }, [session]);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => setIsLoading(false), 3000); // 2 seconds delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      const response = await fetch("/api/get-videos", {
        method: "GET",
      });
      const data = await response.json();
      set_video_data(data);
    };
    fetchVideos();
  }, [videos]);

  return (
    <aside
      className={`absolute left-0 top-0 z-9999 hidden h-screen w-90 flex-col overflow-y-hidden border-l border-stroke bg-black dark:border-stroke-dark dark:bg-gray-dark md:flex lg:static lg:translate-x-0 `}
    >

      <div className="relative mb-6 mt-4 px-2">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search videos..."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-400 shadow-md outline-none transition duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary"
            onChange={handleVideoSearch}
            value={videoName}
          />
          <svg
            className="absolute left-4 h-5 w-5 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm8.707-4.293l-4.367-4.367"
            />
          </svg>
        </div>
      </div>

      <div>
        {isLoading ? (
          // Render Skeleton Loader
          Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="video-card flex animate-pulse items-start gap-3 p-2 transition-colors"
            >
              {/* Skeleton Thumbnail */}
              <div className="thumbnail relative h-15 w-25 flex-shrink-0 rounded-lg bg-gray-700"></div>

              <div className="details flex flex-1 flex-col space-y-2">
                {/* Skeleton Title */}
                <div className="h-4 w-3/4 rounded bg-gray-600"></div>
                {/* Skeleton Meta Information */}
                <div className="h-3 w-1/2 rounded bg-gray-500"></div>
              </div>
            </div>
          ))
        ) : filteredVideos.length > 0 ? (
          filteredVideos.map((each_video: videos) => (
            <Link
              key={each_video.id}
              href={`/play/watch_video/${each_video.id}`}
            >
              <div className="video-card flex cursor-pointer items-start gap-3 p-2 transition-colors hover:bg-gray-700">
                {/* Thumbnail */}
                <div className="thumbnail relative h-15 w-25 flex-shrink-0">
                  <Image
                    src="/images/codered.jpg"
                    alt={`Thumbnail of ${each_video.video_name}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>

                <div className="details flex flex-1 flex-col">
                  {/* Video Title */}
                  <h3 className="line-clamp-2 text-sm font-medium text-white ">
                    {each_video.video_name}
                  </h3>

                  <span className="mt-1 text-xs text-gray-400">
                    {each_video?.views! > 1
                      ? each_video.views + " views"
                      : each_video.views + " view"}{" "}
                    ·{" "}
                    {each_video.createdAt
                      ? formatDistanceToNow(new Date(each_video.createdAt), {
                          addSuffix: true,
                        })
                      : "No date available"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center text-gray-400">
            Type the name of the video
          </div>
        )}
      </div>
      {/*Start Powered by GenzTechLabs */}
      <div className="mt-auto flex items-center justify-center border-t border-stroke p-4 dark:border-stroke-dark">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Powered by{" "}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
           TechStack
          </a>
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
