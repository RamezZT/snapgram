import GridPostList from "@/components/shared/GridPostList";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserPosts } from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, isLoading } = useUserContext();
  const { data: posts, isLoading: isPostLoading } = useGetUserPosts(user.id);
  if (isLoading) return <Loader />;
  return (
    <div className="flex flex-col flex-1 p-12 w-full gap-12">
      <div className="profile-header flex gap-8 w-full 400">
        <img src={user.imageUrl} alt="" className="w-24 h-24 rounded-full" />
        <div className="flex flex-col w-full gap-4">
          <div>
            <div className="flex gap-12 justify-between items-start  min-w-[400px]">
              <div className="flex items-center justify-between  w-full max-w-[30rem]">
                <p className="h1-bold">{user.name}</p>
                <Link to={`/update-profile/${user.id}`}>
                  <div className="flex items-center justify-between gap-2 bg-[#101012] rounded-lg py-2 px-4">
                    <img
                      src="/assets/icons/edit.svg"
                      alt="edit"
                      className="w-[24px] h-[24px]"
                    />
                    <p className="text-[12px] ">Edit Profile</p>
                  </div>
                </Link>
              </div>
            </div>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
          <div className="flex gap-8 ">
            <div>
              <p className="text-primary-500">{posts?.documents.length}</p>
              <p>Posts</p>
            </div>
            <div>
              <p className="text-primary-500">---</p>
              <p>followers</p>
            </div>
            <div>
              <p className="text-primary-500">---</p>
              <p>Following</p>
            </div>
          </div>
          <p>Third year SWE</p>
        </div>
      </div>
      {isPostLoading ? (
        <Loader />
      ) : !posts ? (
        <p>no Posts</p>
      ) : (
        <GridPostList posts={posts.documents} />
      )}
    </div>
  );
};

export default Profile;
