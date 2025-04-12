import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { FaCircleUser, FaRegThumbsUp } from "react-icons/fa6";
import { Button } from "@nextui-org/button";
import useStore from "@/zustand/videoStore";
import { useSession } from "next-auth/react";
import { comment } from "@/types/comment";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { FaCrown, FaThumbsUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { videos } from "@/types/video";

interface Comment {
  id: string;
  comment_text: string;
  user_name: string;
}

interface ModalComponentProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  video_id: string;
}

const ModalComponent = ({
  isOpen,
  onOpenChange,
  video_id,
}: ModalComponentProps) => {
  const [commentText, setCommentText] = useState<string>("");
  const [comments, setAllComments] = useState<Comment[]>([]);
  const [commentsFromDb, setComentsFromDb] = useState<comment[]>([]);
  const [isCommentLiked, setIsCommentLiked] = useState<boolean>(false);
  const [replyVisible, setReplyVisible] = useState<string | null>(null);
  const [updateComments, setUpdateComments] = useState<boolean>(false);
  const [commentReplyText, setCommentReplyText] = useState<string>("");
  const [repliesVisible, setRepliesVisible] = useState<string | null>(null);

  const { updateVideos } = useStore();
  const { videos } = useStore();
  const { data: session } = useSession();
  const username = session?.user?.email || "Anonymous";

  useEffect(() => {
    getAllComments(video_id);
  }, [video_id, isCommentLiked, updateComments]);

  const getAllComments = async (video_id: string) => {
    try {
      const response = await fetch(`/api/video-meta/comment/${video_id}`);
      const data = await response.json();
      setAllComments(data);
      setComentsFromDb(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = session?.user.id;

    try {
      const response = await fetch(`/api/video-meta/comment/${video_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: commentText, userId }),
      });
      const data = await response.json();

      setCommentText("");
      setAllComments((prevComments) => [
        ...prevComments,
        {
          id: data.comment_id,
          comment_text: commentText,
          user_name: username,
        },
      ]);
      setUpdateComments(!updateComments);
      updateVideos(data.videos);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    const userId = session?.user.id;
    try {
      await fetch(`/api/comment-meta/like-comment/${commentId}`, {
        method: "POST",
        body: JSON.stringify({ commentId, userId }),
        headers: { "Content-Type": "application/json" },
      });
      setIsCommentLiked(!isCommentLiked);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislikeComment = async (commentId: string) => {
    const userId = session?.user.id;
    try {
      await fetch(`/api/comment-meta/like-comment/${commentId}`, {
        method: "DELETE",
        body: JSON.stringify({ commentId, userId }),
        headers: { "Content-Type": "application/json" },
      });
      setIsCommentLiked(!isCommentLiked);
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };

  const handleReplyComment = async (
    e: React.FormEvent<HTMLFormElement>,
    commentId: string,
  ) => {
    e.preventDefault();
    try {
      const userId = session?.user.id;
      await fetch(`/api/comment-meta/reply-comment/${commentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, userId, comment: commentReplyText }),
      });
      setCommentReplyText("");
      setReplyVisible(null);
      setUpdateComments(!updateComments);
    } catch (error) {
      toast.error("Failed to post reply");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="max-h-[90vh] rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl"
      size="2xl"
    >
      <ModalContent>
        <ModalHeader className="border-b border-white/10 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Comments</h2>
        </ModalHeader>
        <ModalBody className="p-0">
          {/* Comments List */}
          <div className="custom-scrollbar max-h-[60vh] overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {commentsFromDb?.map((comment) => (
                <div key={comment.id} className="relative space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={comment.user.profile_image_url}
                        alt={comment.user.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">
                          {comment.user.username.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-400">
                          {comment.createdAt &&
                            formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.comment_text}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            comment.commentLikes.some(
                              (like) =>
                                like.commentId === comment.id &&
                                like.userId === session?.user.id,
                            )
                              ? handleDislikeComment(comment.id)
                              : handleLikeComment(comment.id)
                          }
                          className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
                        >
                          {comment.commentLikes.some(
                            (like) =>
                              like.commentId === comment.id &&
                              like.userId === session?.user.id,
                          ) ? (
                            <FaThumbsUp className="h-4 w-4" />
                          ) : (
                            <FaRegThumbsUp className="h-4 w-4" />
                          )}
                          <span>{comment.commentLikes.length}</span>
                        </button>
                        <button
                          onClick={() =>
                            setReplyVisible(
                              replyVisible === comment.id ? null : comment.id,
                            )
                          }
                          className="text-sm text-gray-400 hover:text-white"
                        >
                          Reply
                        </button>
                      </div>

                      {/* Reply Form */}
                      {replyVisible === comment.id && (
                        <form
                          onSubmit={(e) => handleReplyComment(e, comment.id)}
                          className="mt-4"
                        >
                          <div className="relative">
                            <input
                              type="text"
                              value={commentReplyText}
                              onChange={(e) =>
                                setCommentReplyText(e.target.value)
                              }
                              placeholder="Write a reply..."
                              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                            />
                            <button
                              type="submit"
                              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-red-500 px-4 py-1 text-sm font-medium text-white hover:bg-red-600"
                            >
                              Post
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Replies */}
                      {comment.commentReplies.length > 0 && (
                        <div className="mt-4">
                          <button
                            onClick={() =>
                              setRepliesVisible(
                                repliesVisible === comment.id
                                  ? null
                                  : comment.id,
                              )
                            }
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            {repliesVisible === comment.id
                              ? "Hide replies"
                              : `Show ${comment.commentReplies.length} replies`}
                          </button>

                          {repliesVisible === comment.id && (
                            <div className="mt-4 space-y-4 pl-4">
                              {comment.commentReplies.map((reply) => (
                                <div
                                  key={reply.id}
                                  className="flex items-start gap-4"
                                >
                                  <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
                                    <Image
                                      src={comment.user.profile_image_url}
                                      alt={comment.user.username}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-white">
                                        {comment.user.username}
                                      </span>
                                      {comment.user.role === "admin" && (
                                        <FaCrown className="h-4 w-4 text-yellow-500" />
                                      )}
                                    </div>
                                    <p className="mt-1 text-gray-300">
                                      {reply.replyText}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comment Input */}
          <div className="border-t border-white/10 px-6 py-4">
            <form onSubmit={handlePostComment} className="space-y-4">
              <textarea
                value={commentText}
                onChange={handleInputChange}
                placeholder="Add a comment..."
                className="h-24 w-full rounded-lg border border-white/10 bg-white/5 p-4 text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                required
              />
              <button
                type="submit"
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 p-px focus:outline-none focus:ring-2 focus:ring-red-500/20"
              >
                <div className="relative flex h-11 items-center justify-center space-x-2 bg-black transition-colors group-hover:bg-black/80">
                  <span className="text-sm font-medium text-white">
                    Post Comment
                  </span>
                </div>
              </button>
            </form>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
