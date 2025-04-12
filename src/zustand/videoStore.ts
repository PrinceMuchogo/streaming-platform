import { videos } from "@/types/video";
import { create } from "zustand";

interface Video {
  id: string;
  video_name: string;
  caption: string;
  thumbnail: string;
  video: string;
  view: number;
  likes?: number;
  url: string;
  userID: string;
  videoComments: Array<Object>;
  createdAt: Date;
  updatedAt: Date;
}

interface videoState {
  videos: Array<videos>;
  setVideos: (videos: Array<videos>) => void;
  updateVideos: (updatedVideos: Array<videos>) => void;
}

const useStore = create<videoState>((set) => ({
  videos: [],
  setVideos: (videos) => set({ videos }),
  updateVideos: (updatedVideos) =>
    set((state) => ({
      videos: state.videos.map((video) => {
        // Find the corresponding updated video if it exists
        const updatedVideo = updatedVideos.find((v) => v.id === video.id);

        return updatedVideo ? updatedVideo : video;
      }),
    })),
}));

export default useStore;
