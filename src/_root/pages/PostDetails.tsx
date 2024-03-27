import { useUserContext } from "@/context/AuthContext";
import { timeSince } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";
import {
  useDeletePost,
  useGetPostById,
  useGetUserPosts,
} from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import EnsuringModal from "@/components/shared/EnsuringModal";
import PostStats from "@/components/shared/PostStats";
import RelatedPostCard from "@/components/shared/RelatedPostCard";
const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isLoading: isUserPostLoading } = useGetPostById(id!);
  const { user } = useUserContext();
  const { mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();
  const { data: recentPosts, isLoading: isRecentPostsLoading } =
    useGetUserPosts(user.id!);

  const handleDeletePost = async () => {
    await deletePost({
      postId: post!.$id,
      imageId: post!.imageId,
    });
  };
  return isUserPostLoading ? (
    <Loader />
  ) : !post ? (
    <h1>error</h1>
  ) : (
    <div className="p-12 xl:p-24 flex-col flex-1 overflow-scroll custom-scrollbar transition-all">
      <div className="flex gap-4 max-md:hidden mb-12">
        <Link to="./">
          <img src="/public/assets/icons/back.svg" alt="back" />
        </Link>
        <p>Back</p>
      </div>
      <div className="flex-1 flex max-xl:flex-col  max-sm:p-2 p-6 gap-6  relative outline-1 outline-dark-4 rounded-2xl outline  bg-dark-2">
        {isDeleting && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md ">
            <Loader className="scale-150" />
          </div>
        )}
        <img
          src={post.imageUrl || "assets/icons/profile-placeholder.svg"}
          alt="post_image"
          className="h-80 lg:h-[480px] xl:w-[48%] rounded-xl transition-all"
        />
        <div className="flex-1 flex flex-col max-sm:p-3 p-6 gap-6 justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center border-b-2 border-dark-4 pb-6">
              <div className="flex gap-4">
                <Link to={`/profile/${post.creator.$id}`}>
                  <img
                    src={
                      post.creator?.imageUrl ||
                      "assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="rounded-full w-12 lg:h-12"
                  />
                </Link>
                <div className="flex flex-col gap-2 ">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post.creator.name}
                  </p>
                  <div className="flex gap-4 items-center text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {timeSince(post.$createdAt)}
                    </p>
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
            <div className="small-medium lg:base-medium">
              <p>{post.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-between">
              <div className="flex-items-center gap-3">
                <div className="flex flex-col">
                  <div className="flex-center gap-2 text-light-3"></div>
                </div>
              </div>
            </div>
          </div>
          <PostStats post={post} userId={user.id} />
        </div>
      </div>
      <div className="outline outline-1 outline-dark-4 mt-12 mb-12" />
      <h1 className="h3-bold mt-12">More Related Posts</h1>

      <div>
        {isRecentPostsLoading ? (
          <Loader />
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 transition-all gap-x-4 gap-y-2 place-items-center items-center p-6 max-sm:p-0">
            {recentPosts?.documents.map((post) => (
              <RelatedPostCard
                key={post.$id}
                post={post}
                user={{
                  id: user.id,
                  imageUrl: user.imageUrl,
                  name: user.name,
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
