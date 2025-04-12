"use client";
import React, { useEffect, useState } from "react";
import { videos } from "@/types/video";
import VideoMetaOptions from "../VideoMetaOptions";
import { formatDistanceToNow } from "date-fns";
import VideoPlayer from "../Video/VideoPlayer";
import { User } from "@/types/user";
import { favouriteVideo } from "@/types/favouriteVideo";

interface VideoProps {
  videos: {
    id?: string;
    videoID?: string;
    userID?: string;
    createdAt?: Date;
    updatedAt?: Date;
    user?: User;
    video?: videos;
  }[];
}

const FavouriteVideoFeedCard = ({ videos }: VideoProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for demonstration purposes
    const timer = setTimeout(() => setIsLoading(false), 3000); // 2 seconds
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="feed-container mb-6 flex flex-col items-center bg-black w-full">
      {videos.length > 0 ? (
        videos.map((video: favouriteVideo, index) => (
          <div
            key={index}
            className="flex h-screen min-h-screen w-full flex-grow flex-col bg-black"
          >
            {/* Video Section */}
            <VideoPlayer video={video.video!} />

            {/* Meta Options */}
            <VideoMetaOptions video={video.video!} icon_size={15} />

            {/* Video Information */}
            <div className="flex w-full px-2 pb-2 text-white">
              <div className="video-information">
                {/* Video Name */}
                <div className="flex w-full flex-wrap text-xs text-white md:text-sm">
                  <p>{video?.video?.video_name?.replace(".mp4", "")}</p>
                </div>
                {/* Caption */}
                <div>
                  <p className="text-xs text-gray-500">
                    {video.video?.caption}
                  </p>
                </div>
                {/* Date Info */}
                <div className="pt-1 text-xs">
                  <span>
                    {" "}
                    Bookmarked{" "}
                    {video.createdAt
                      ? formatDistanceToNow(new Date(video.createdAt), {
                          addSuffix: true,
                        })
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex min-h-screen items-center justify-center text-white">
          <p>No favourite videos available</p>
        </div>
      )}
    </div>
  );
};

export default FavouriteVideoFeedCard;
