"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Heart, MessageCircle, Share2, Bookmark, BookmarkCheck } from "lucide-react";
import type { Song } from "@/types/music";

interface MusicMetaOptionsProps {
  song: Song;
  icon_size: number;
}

const MusicMetaOptions = ({ song, icon_size }: MusicMetaOptionsProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(song.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { data: session } = useSession();

  const handleLike = () => {
    if (!session) return;
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleBookmark = () => {
    if (!session) return;
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-white/5 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-6">
        {/* Like Button */}
        <button
          className="group flex items-center gap-2"
          onClick={handleLike}
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
        <button className="group flex items-center gap-2">
          <MessageCircle
            size={icon_size}
            className="text-white transition-colors group-hover:text-blue-500"
          />
          <span className="text-sm text-white">
            {song.musicComments?.length || 0}
          </span>
        </button>

        {/* Share Button */}
        <button className="group flex items-center gap-2">
          <Share2
            size={icon_size}
            className="text-white transition-colors group-hover:text-green-500"
          />
        </button>
      </div>

      {/* Bookmark Button */}
      <button
        className="group"
        onClick={handleBookmark}
      >
        {isBookmarked ? (
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
    </div>
  );
};

export default MusicMetaOptions;