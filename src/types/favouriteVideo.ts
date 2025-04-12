import { User } from "./user"
import { videos } from "./video"

export type favouriteVideo = {
    id?: string
  videoID?: string
  userID?: string
  createdAt?: Date
  updatedAt?: Date
  user?: User
  video?: videos
}