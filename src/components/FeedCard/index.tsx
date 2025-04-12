import React, { useState, useEffect } from "react";
import { videos } from "@/types/video";
import VideoMetaOptions from "../VideoMetaOptions";
import { formatDistanceToNow } from "date-fns";
import VideoPlayer from "../Video/VideoPlayer";

interface VideoProps {
  videos: {
    id: string;
    video_name: string;
    caption: string;
    thumbnail_url: string;
    video: string;
    view: number;
    url: string;
    storeID: string;
    videoComments: [];
    favourite_videos: [];
    userID: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

const FeedCard = ({ videos }: VideoProps) => {

  return (
    <div className="mb-6 flex w-full flex-col items-center">
      {videos.length > 0 ? (
        videos.map((video: videos, index) => (
          <div
            key={video.id}
            className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 md:min-h-[600px] lg:min-h-[700px] xl:min-h-[800px]"
          >
            {/* Video Player */}
            <div className="relative flex-1">
              <VideoPlayer video={video} />
            </div>

            {/* Video Information */}
            <div className="relative space-y-4 border-t border-white/10 bg-black/60 p-4">
              <VideoMetaOptions video={video} icon_size={15} />

              <div className="space-y-2 text-white">
                <h3 className="text-lg font-semibold">
                  {video.video_name?.replace(".mp4", "")}
                </h3>
                <p className="text-sm text-gray-400">{video.caption}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>
                    {video.createdAt
                      ? formatDistanceToNow(new Date(video.createdAt), {
                          addSuffix: true,
                        })
                      : ""}
                  </span>
                  <span>•</span>
                  <span>{video.views} views</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-lg border border-white/10 bg-black/40 p-8 text-center">
            <p className="text-gray-400">No videos available</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedCard;