import { Order } from "./order"
import { Payment } from "./payment"
import { ProductRating } from "./productRating"
import { ProductReview } from "./productReview"
import { videos } from "./video"

export type User = {
    id: string
    email: string
    password: string
    profile_image_url: string
    uploadedProfileImage: string
    imagePublicID: string
    role: string
    createdAt: Date
    updatedAt: Date
    isOnline: boolean
    username: string
    comments: []
    favourite_videos: []
    likes: []
    video: videos[]
    views: []
    payment: Payment[]
    order : Order[]
    review: ProductReview[]
    rating: ProductRating[]
}