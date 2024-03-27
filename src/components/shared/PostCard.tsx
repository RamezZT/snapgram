import { useUserContext } from "@/context/AuthContext";
import { timeSince } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { useDeletePost } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import EnsuringModal from "./EnsuringModal";
type PostCardProps = {
  post: Models.Document;
};
const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();
  const handleDeletePost = async () => {
    await deletePost({
      postId: post.$id,
      imageId: post.imageId,
    });
  };
  if (!post.creator) return;
  return (
    <div className={`relative post-card`}>
      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md ">
          <Loader className="scale-150" />
        </div>
      )}
      <div className="flex-between">
        <div className="flex-items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post.creator?.imageUrl || "assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {timeSince(post.$createdAt)}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <Link
            to={`/update-post/${post.$id}`}
            className={`${user.id !== post.creator.$id && "hidden"}`}
          >
            <img
              src="/assets/icons/edit.svg"
              alt="edit"
              width={26}
              height={26}
            />
          </Link>
          {/* prettier-ignore */}
          <div className={`${user.id !== post.creator.$id && "hidden"} cursor-pointer`}>
          <EnsuringModal
            onClick={handleDeletePost}
            title="Delete Post Confirmation"
            description="this action can't be undone, are u sure?"
          >
            <img
              src="/assets/icons/delete.svg"
              alt="edit"
              width={26}
              height={26}
            />
          </EnsuringModal>
          </div>
        </div>
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <img
            src={post.imageUrl || "assets/icons/profile-placeholder.svg"}
            alt="psot_image"
            className="post-card_img"
          />
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>

      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
