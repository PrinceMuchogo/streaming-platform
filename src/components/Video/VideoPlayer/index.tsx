"use client";

import { videos } from "@/types/video";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  video: videos;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [hasSentView, setHasSentView] = useState(false);
  const { data: session } = useSession();

  const handleOnPlay = async () => {
    if (hasSentView) return;
    setHasSentView(true);
    try {
      const res = await fetch(`/api/video-meta/view/${video.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: session?.user?.email,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update view");
      }
    } catch (error) {
      console.log("Failed to view:", error);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const showControlsTemporarily = () => {
    setControlsVisible(true);
    setTimeout(() => setControlsVisible(false), 3000);
  };

  const handleVisibility = (entries: IntersectionObserverEntry[]) => {
    if (!videoRef.current) return;

    const entry = entries[0];
    if (!entry.isIntersecting) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const vid = videoRef.current;
    if (vid) {
      vid.preload = "metadata"; // Load metadata only initially
    }

    const observer = new IntersectionObserver(handleVisibility, {
      threshold: 0.5,
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div
      className="group relative mx-auto my-4 h-[63vh] w-full max-w-screen-lg overflow-hidden px-4 md:h-[85vh]"
      onClick={togglePlayPause}
      onMouseMove={showControlsTemporarily}
    >
      <video
        ref={videoRef}
        className="h-full w-full rounded-lg bg-black object-contain"
        loop
        playsInline
        preload="auto"
        onPlay={handleOnPlay}
        id={video ? video.id : ""}
        key={video ? video.id : ""}
      >
        <source src={video ? video.url : ""} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Play/Pause Button Overlay */}
      <button
        className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300 ${
          isPlaying ? "opacity-0" : "opacity-100"
        } group-hover:opacity-100`}
      >
        {isPlaying ? (
          <Pause className="h-12 w-12 text-white transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <Play className="h-12 w-12 text-white transition-transform duration-300 group-hover:scale-110" />
        )}
      </button>

      {/* Status Indicator */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black/60 px-4 py-2 transition-opacity duration-300 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        } group-hover:opacity-100`}
      >
        <span className="text-sm font-medium text-white">
          {isPlaying ? "Playing" : "Paused"}
        </span>
      </div>
    </div>
  );
};

export default VideoPlayer;
