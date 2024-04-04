import { Models } from "appwrite";
import PostStats from "./PostStats";
import { Link } from "react-router-dom";
const RelatedPostCard = ({
  post,
  user,
}: {
  post: Models.Document;
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
}) => {
  return (
    <li className="relative">
      <Link to={`/posts/${post.$id}`} className="grid-post-link">
        <div className="min-w-80 w-full h-80">
          <img
            src={post.imageUrl}
            alt=""
            className="rounded-3xl object-cover"
          />
        </div>
      </Link>
      {/* absolute bottom-0 p-5 flex-between w-full bg-gradient-to-t from-dark-3 to-transparent rounded-b-[24px] gap-2 */}
      <div className="absolute bottom-2 flex-between gap-2 w-full p-2">
        <div className="flex gap-2">
          <img
            src={user.imageUrl}
            alt="profile-pic"
            className="w-8 h-8 rounded-full"
          />
          <p>{user.name}</p>
        </div>
        <PostStats post={post} userId={user.id} />
      </div>
    </li>
  );
};

export default RelatedPostCard;
