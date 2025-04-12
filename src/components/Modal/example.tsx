import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import ButtonDefault from "../Buttons/ButtonDefault";
import { useDisclosure } from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { list } from "postcss";
import { FaCircleUser } from "react-icons/fa6";
import useStore from "@/zustand/videoStore";

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
  const [comments, setAllComments] = useState<Array<any>>([])

  const { updateVideos } = useStore()

  useEffect(() => {
    getAllComments(video_id);
  }, [video_id, comments]);

  // Write logic for fetching comments from the database
  const getAllComments = async (video_id: String) => {
    const response = await fetch(`/api/video-meta/comment/${video_id}`);
    const data = await response.json();

    setAllComments(data)
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
  };

  const handlePostComment = async () => {
    const response = await fetch(`/api/video-meta/comment/${video_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: commentText,
      }),
    });
    const data = await response.json();

    console.log(data);
    // Now empty the textbox
    setCommentText("");

    // After posting the comment, fetch the comments again and update the global state
    updateVideos(data.videos)
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="bg-black lg:w-100"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Comments
              </ModalHeader>
              <ModalBody>

                <div className="text-white flex flex-col gap-4 ">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-center border-white ">
                      <div>
                      <FaCircleUser size={20} className="mr-2"/>
                      </div>
                      <p>{comment.comment_text}</p>
                    </div>
                  ))}
                </div>

                <form action={handlePostComment}>
                  <textarea
                    className="p-1 outline-none"
                    rows={5}
                    cols={40}
                    name="comment"
                    id="comment"
                    value={commentText}
                    onChange={handleInputChange}
                  ></textarea>
                  <button type="submit">Post Comment</button>
                </form>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalComponent;
