"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import type { Song } from "@/types/music";
import MusicPlayer from "./MusicPlayer";
import MusicMetaOptions from "./MusicMetaOptions";

interface MusicFeedCardProps {
  songs: Song[];
}

const MusicFeedCard = ({ songs }: MusicFeedCardProps) => {
  return (
    <div className="mb-6 flex w-full flex-col items-center space-y-4">
      {songs.length > 0 ? (
        songs.map((song) => (
          <div
            key={song.id}
            className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40"
          >
            <div className="flex items-start space-x-4 p-4">
              {/* Album Cover */}
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                  src={song.cover_url}
                  alt={song.album}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Song Information */}
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-white">{song.title}</h3>
                <p className="text-sm text-gray-400">{song.artist}</p>
                <p className="text-xs text-gray-500">{song.album}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>
                    {formatDistanceToNow(new Date(song.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <span>•</span>
                  <span>{song.plays} plays</span>
                </div>
              </div>
            </div>

            {/* Music Player */}
            <div className="px-4 pb-2">
              <MusicPlayer song={song} />
            </div>

            {/* Meta Options */}
            <div className="border-t border-white/10">
              <MusicMetaOptions song={song} icon_size={15} />
            </div>
          </div>
        ))
      ) : (
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-lg border border-white/10 bg-black/40 p-8 text-center">
            <p className="text-gray-400">No songs available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicFeedCard;