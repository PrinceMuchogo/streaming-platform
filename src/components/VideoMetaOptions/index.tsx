import { videos } from "@/types/video";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ModalComponent from "../Modal";
import { useDisclosure } from "@nextui-org/modal";
import useStore from "@/zustand/videoStore";
import Link from "next/link";
import { favouriteVideo } from "@/types/favouriteVideo";
import { Heart, MessageCircle, ShoppingCart, Bookmark, BookmarkCheck } from "lucide-react";

interface VideoMetaOptionsProps {
  video: videos;
  icon_size: number;
}

const VideoMetaOptions = ({ video, icon_size }: VideoMetaOptionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video?.likes);
  const { data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const video_id = video?.id;
  const { videos, updateVideos } = useStore();
  const [isVideoBookmarked, setIsVideoBookmarked] = useState<boolean>(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await fetch(`/api/user/like/${video?.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: session?.user?.email,
          }),
        });

        const body = await res.json();
        if (!res.ok) throw new Error("Failed to fetch like status");
        setIsLiked(body.flag);
      } catch (error) {
        console.log("Failed to fetch like status:", error);
      }
    };

    if (session?.user?.email) {
      fetchLikeStatus();
    }
  }, [session?.user?.email, video?.id]);

  const handleNotLoggedIn = () => {
    console.log("User not logged in");
  };

  const handleOnLike = async () => {
    const newLikeStatus = !isLiked;
    const updatedLikesCount = newLikeStatus ? likesCount! + 1 : likesCount! - 1;

    setIsLiked(newLikeStatus);
    setLikesCount(updatedLikesCount);

    try {
      const res = await fetch(`/api/video-meta/like/${video.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: session?.user?.email,
          flag: newLikeStatus ? 1 : 0,
        }),
      });

      if (!res.ok) throw new Error("Failed to update likes");
    } catch (error) {
      console.log("Failed to like:", error);
      setIsLiked(!newLikeStatus);
      setLikesCount(newLikeStatus ? likesCount! - 1 : likesCount! + 1);
    }
  };

  const handleOnComment = async () => {
    try {
      await fetch(`/api/video-meta/comment/${video.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: session?.user?.email,
        }),
      });
    } catch (error) {
      console.log("Failed to comment:", error);
    }
  };

  const handleBookmarkVideo = async () => {
    try {
      const userEmail = session?.user?.email;

      const res = await fetch(`/api/user/get-userId-by-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (res.status === 200) {
        const data = await res.json();
        const userId = data.user?.id;
        const videoId = video.id;

        const bookmarkVideoApiCall = await fetch(`/api/favourite-videos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, videoId }),
        });

        if (bookmarkVideoApiCall.ok) {
          setIsVideoBookmarked(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnbookmarkVideo = async () => {
    try {
      const userEmail = session?.user?.email;

      const res = await fetch(`/api/user/get-userId-by-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });

      if (res.status === 200) {
        const data = await res.json();
        const userId = data.user?.id;
        const videoId = video.id;

        const unbookmarkVideoApiCall = await fetch("/api/favourite-videos", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, videoId }),
        });

        if (unbookmarkVideoApiCall.ok) {
          setIsVideoBookmarked(false);
        }
      }
    } catch (error) {
      console.log("Error when unbookmarking video!");
    }
  };

  useEffect(() => {
    const checkIfVideoIsBookmarked = () => {
      const videoExistsInBookmarks = videos.some((video) =>
        video.favourite_videos?.some(
          (favVideo: favouriteVideo) => favVideo.videoID === video_id
        )
      );
      setIsVideoBookmarked(videoExistsInBookmarks);
    };

    checkIfVideoIsBookmarked();
  }, [videos, video_id]);

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-white/5 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        {/* Like Button */}
        <button
          className="group flex items-center gap-2"
          onClick={session ? handleOnLike : handleNotLoggedIn}
        >
          <Heart
            size={icon_size}
            className={`transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-white group-hover:text-red-500"
            }`}
          />
          <span className="text-sm text-white">{likesCount}</span>
        </button>

        {/* Comment Button */}
        <button
          className="group flex items-center gap-2"
          onClick={session ? onOpen : handleNotLoggedIn}
        >
          <MessageCircle
            size={icon_size}
            className="text-white transition-colors group-hover:text-blue-500"
          />
          <span className="text-sm text-white">{video?.videoComments?.length}</span>
        </button>

        {/* Store Icon */}
        {video?.storeID && (
          <Link
            href={`/store/${video?.storeID}`}
            className="group flex items-center gap-2"
          >
            <ShoppingCart
              size={icon_size}
              className="text-white transition-colors group-hover:text-green-500"
            />
          </Link>
        )}
      </div>

      {/* Bookmark Button */}
      <button
        className="group"
        onClick={isVideoBookmarked ? handleUnbookmarkVideo : handleBookmarkVideo}
      >
        {isVideoBookmarked ? (
          <BookmarkCheck
            size={icon_size}
            className="text-yellow-500 transition-colors group-hover:text-yellow-400"
          />
        ) : (
          <Bookmark
            size={icon_size}
            className="text-white transition-colors group-hover:text-yellow-500"
          />
        )}
      </button>

      <ModalComponent
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        video_id={video_id}
      />
    </div>
  );
};

export default VideoMetaOptions;