import { comment } from "./comment";
import { favouriteVideo } from "./favouriteVideo";

export type videos = {
    id: string;
    video_name?: string
    caption?: string
    thumbnail_url: string
    video?: string
    views?: number
    likes?: number
    url?: string
    userID?: string
    storeID?: string
    package?: string
    videoComments?: Array<comment>
    favourite_videos?: Array<favouriteVideo>
    createdAt?: Date
    updatedAt?: Date
};