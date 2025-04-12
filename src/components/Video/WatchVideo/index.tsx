"use client";
import VideoPlayer from "@/components/Video/VideoPlayer";
import useStore from "@/zustand/videoStore";
import VideoMetaOptions from "@/components/VideoMetaOptions";
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { videos } from "@/types/video";
import "next-cloudinary/dist/cld-video-player.css";
import { FaCrown,FaThumbsUp } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { comment } from "@/types/comment";
import Image from "next/image";
import { toast } from "react-toastify";
import { CommentLikes } from "@/types/commentLikes";
import {  FaRegThumbsUp } from "react-icons/fa6";

interface Comment {
  id: string;
  comment_text: string;
  user_name: string;
}
interface WatchVideoProps {
  id: string;
}

const WatchVideo = ({ id }: WatchVideoProps) => {
  const { videos } = useStore();
  const [video, setCurrentVideoMetaData] = useState<videos | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [commentText, setCommentText] = useState<string>("");
  const [commentReplyText, setCommentReplyText] = useState<string>("");
  const [comments, setAllComments] = useState<Comment[]>([]);
  const { data: session } = useSession();
  const { updateVideos } = useStore();
  const username = session?.user?.email || "Anonymous";

  const [commentsFromDb, setCommentsFromDb] = useState<comment[]>();
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(true);
  const [replyVisible, setReplyVisible] = useState<string | null>(null); // Tracks which reply field is open

  // track if the replies to a reply are showing / visible
  const [repliesVisible, setRepliesVisible] = useState<string | null>(null);

  // Update state variable if comment is liked or disliked
  const [commentsWithLikes, setCommentsWithLikes] = useState<CommentLikes[]>([])
  const [isCommentLiked, setIsCommentLiked] = useState<boolean>(false)

  useEffect(() => {
    async function get_video() {
      let res = await fetch(`/api/get-video/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      setCurrentVideoMetaData(res);
      // setIsLoading(false);
    }
    get_video();
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentText(e.target.value);
  };

  const handleReplyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommentReplyText(e.target.value);
  };

  const handleReplyComment = async (
    e: React.FormEvent<HTMLFormElement>, // Add event type
    commentId: string,
  ) => {
    e.preventDefault(); // Prevent form submission from reloading the page


    try {
      const userId = session?.user.id;

      // Need the user ID and the parent comment ID as well as comment text
      const response = await fetch(
        `/api/comment-meta/reply-comment/${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentId: commentId,
            userId: userId,
            comment: commentReplyText,
          }),
        },
      );

      // Now do domething with the response
      const data = await response.json();

      setCommentReplyText("");
    } catch (error) {
      toast.error("Oops something went wrong");
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = session?.user.id;

    try {
      const response = await fetch(`/api/video-meta/comment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: commentText,
          userId: userId,
        }),
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
      updateVideos(data.videos);
    } catch (error) {
      toast.error("Error posting comment");
    }
  };

  useEffect(() => {
    async function getCommentsForCurrentVideo() {
      const res = await fetch(`/api/video-meta/comment/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());

      console.log(res)

      setCommentsFromDb(res);
      setIsLoadingComments(false);
    }
    getCommentsForCurrentVideo();
  }, [id,  isCommentLiked,comments]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 3000); // Simulate loading for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleLikeComment = async(commentId: string) => {

    const userId = session?.user.id

    const userData = {
      commentId,
      userId
    }
    const response = await fetch(`/api/comment-meta/like-comment/${commentId}`, {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      }
    }).then((response) => response.json())


    setIsCommentLiked(!isCommentLiked)

  }

  const handleDislikeComment = async (commentId: string)=> {
    const userId = session?.user.id

    const userData = {
      commentId,
      userId
    }

    const response = await fetch(`/api/comment-meta/like-comment/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "application/json",
      }
    }).then((response) => {
      setIsCommentLiked(!isCommentLiked)
    })

  }

  return (
    <div>
      <div className="feed-container flex w-full flex-col bg-black">
        <div className="w-full bg-black">
          {<VideoPlayer video={video!} />}

          {<VideoMetaOptions video={video!} icon_size={20} />}

          <div className="flex w-full pb-2 pl-2 text-white">
            <div className="video-information w-full">
              {
                <>
                  <div className="flex w-full flex-wrap text-xs text-white md:text-sm">
                    <p>{video?.video_name?.replace(".mp4", "")}</p>
                  </div>
                  <div>
                    <p className=" text-xs text-gray-500">{video?.caption}</p>
                  </div>
                  <div className="flex flex-col">
                    <div className="date-and-metrics flex items-center gap-1 text-xs">
                      <div className="flex gap-1">
                        <span>{video?.views}</span>
                        <span>Views</span>
                      </div>
                      <div className="small-circle"></div>
                      <div>
                        <span>
                          {video?.createdAt
                            ? formatDistanceToNow(new Date(video?.createdAt), {
                                addSuffix: true,
                              })
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 w-full">
                      <form onSubmit={handlePostComment} className="flex">
                        <input
                          type="text"
                          value={commentText}
                          onChange={handleInputChange}
                          className=" mb-1 w-full bg-black bg-none text-white outline-none "
                          placeholder="Reply"
                        />
                        <button
                          type="submit"
                          className="mb-1 mr-1 block rounded bg-white p-1 text-black lg:hidden"
                        >
                          Post
                        </button>
                      </form>
                      <hr />
                    </div>
                  </div>
                </>
              }
            </div>
          </div>
        </div>

        <div>
          <div className="mb-5 text-2xl">
            <h1 className="font-bold">Comments</h1>
          </div>
          <div className="comments flex flex-col flex-col-reverse">
            {commentsFromDb &&
              commentsFromDb?.map((comment) => (
                <div
                  key={comment ? comment.id : ""}
                  className="flex gap-2 p-2 text-sm text-white"
                >
                  <span className="user-circle relative block h-12 w-12">
                    <Image
                      src={comment ? comment.user.profile_image_url : ""}
                      width={112}
                      height={112}
                      style={{
                        width: "auto",
                        height: "auto",
                      }}
                      alt="User"
                      className="overflow-hidden rounded-full"
                    />
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span>{comment.user.username || ""}</span>
                      <div className="small-circle"></div>
                      <span>
                        {comment.createdAt
                          ? formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                    </div>
                    <span className="text-gray-500">
                      {comment ? comment.comment_text : ""}
                    </span>
                    <div className="buttons mt-1 flex items-center gap-5 ">
                        <div className="flex items-center gap-1.5" >
                          {
                            comment.commentLikes.some(
                              commentLikeObject => commentLikeObject.commentId === comment.id && commentLikeObject.userId === session?.user.id
                            ) ? <FaThumbsUp size={20} onClick={() => {
                              handleDislikeComment(comment.id)
                            }}/> :
                            <FaRegThumbsUp size={20} onClick={() => {
                            handleLikeComment(comment.id)
                          }} />
                        }
                          
                          <span>
                            {comment.commentLikes.filter(item => item.commentId === comment.id).length}
                          </span>
                        </div>
                      {/* <div className="flex items-center gap-1.5" onClick={() => {
                        handleDislikeComment(comment.id)
                      }}>
                        <FaThumbsDown size={20} className="mt-1" />
                        <span className="mb-1">2</span>
                      </div> */}
                      <div>
                        <span
                          onClick={() =>
                            setReplyVisible(
                              replyVisible === comment.id ? null : comment.id,
                            )
                          }
                          className="cursor-pointer"
                        >
                          Reply
                        </span>
                      </div>
                    </div>
                    {replyVisible === comment.id && (
                      <div className="mt-2 w-full">
                        <form
                          onSubmit={(e) => handleReplyComment(e, comment?.id)}
                          className="flex"
                        >
                          <input
                            type="text"
                            value={commentReplyText}
                            onChange={handleReplyInputChange}
                            className=" mb-1 w-full bg-black bg-none text-white outline-none "
                            placeholder="Reply to comment"
                          />
                          <button
                            type="submit"
                            className="mb-1 mr-1 block rounded bg-white p-1 text-black lg:hidden"
                          >
                            Post
                          </button>
                        </form>
                        <hr />
                      </div>
                    )}

                    <div className="py-2 text-sm text-gray-6">
                      {comment.commentReplies.length > 0 ? (
                        <span
                          className="hover:cursor-pointer "
                          onClick={() => {
                            setRepliesVisible(
                              repliesVisible === comment.id ? null : comment.id,
                            );
                          }}
                        >
                          Replies
                        </span>
                      ) : null}
                    </div>

                    <div className="comment-replies mt-2 flex flex-col gap-5 ">
                      {comment.commentReplies.length > 0 &&
                      repliesVisible === comment.id
                        ? comment.commentReplies.map((each_comment_reply) => {
                            return (
                              <div
                                key={each_comment_reply.id}
                                className=""
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="user-circle relative block h-12 w-12">
                                    <Image
                                      src={
                                        comment
                                          ? comment.user.profile_image_url
                                          : ""
                                      }
                                      width={112}
                                      height={112}
                                      style={{
                                        width: "auto",
                                        height: "auto",
                                      }}
                                      alt="User"
                                      className="overflow-hidden rounded-full"
                                    />

                                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green dark:border-red-600"></span>
                                  </span>

                                  <div className="flex items-center gap-1">
                                    <span>Admin</span>
                                    <FaCrown color="gold" />
                                    {/* <div className="small-circle"></div> */}
                                    {/* <span>
                                        {comment.createdAt
                                          ? formatDistanceToNow(
                                              new Date(each_comment_reply.createdAt),
                                              {
                                                addSuffix: true,
                                              },
                                            )
                                          : ""}
                                      </span> */}
                                  </div>
                                </div>

                                <div className="flex flex-col">
                                  <span className="text-gray-500">
                                    {each_comment_reply.replyText}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        : null}
                    </div>
                    
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchVideo;
