import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import { checkIsLiked } from "@/lib/utils";
import { Loader } from "lucide-react";
type PostStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post.likes.map((user: Models.Document) => user.$id);
  const { data: currentUser } = useGetCurrentUser();
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(savedPostRecord);
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSavePost } =
    useDeleteSavedPost();

  useEffect(() => {
    setIsSaved(Boolean(savedPostRecord));
  }, [currentUser]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likes];
    const hasLiked = newLikes.includes(userId);
    //remove the like if it exists
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else newLikes.push(userId);

    setLikes(newLikes);
    likePost({ postId: post.$id, likesArray: newLikes });
  };
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);

      return;
    }
    savePost({ postId: post.$id, userId });
    setIsSaved(true);
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="Like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-meddium">{likes.length}</p>
      </div>
      <div className="flex gap-2">
        {isSavingPost || isDeletingSavePost ? (
          <Loader />
        ) : (
          <img
            src={`${
              !isSaved ? "/assets/icons/save.svg" : "/assets/icons/saved.svg"
            }`}
            alt="Like"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
