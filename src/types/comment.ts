import { User } from "./user"
import { commentReply } from "./commentReply"
import { CommentLikes } from "./commentLikes"

export type comment = {
    id : string
    comment_text : string
    videoID? : string
    userID ? : string
    createdAt?: Date
    updatedAt : Date
    user: User,
    commentReplies: commentReply[]
    commentLikes: CommentLikes[]
}

