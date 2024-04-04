import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Saved = () => {
  const { user, isLoading: isLoadingUser } = useUserContext();
  const { data, isLoading, fetchNextPage, hasNextPage } = useGetSavedPosts(
    user.id
  );
  const { ref, inView, entry } = useInView({
    threshold: 1,
  });
  console.log(hasNextPage);
  useEffect(() => {
    if (inView) {
      console.log("fetching");
      fetchNextPage();
    } else console.log("not fetching");
  }, [inView]);

  const savedPosts = data?.pages.flatMap((page) =>
    page.documents.map((doc) => doc.post)
  );
  return (
    <div className="savedPosts-container gap-8">
      <h1 className="h1-bold w-full">saved</h1>
      <div className="w-full flex flex-1">
        {isLoading || isLoadingUser ? (
          <div className="flex  w-full">
            <Loader />
          </div>
        ) : savedPosts && savedPosts.length !== 0 ? (
          <div className="w-full flex flex-col gap-16">
            <GridPostList posts={savedPosts} />
            {hasNextPage && (
              <div ref={ref}>
                <Loader />
              </div>
            )}
          </div>
        ) : (
          <div>no Saved Posts</div>
        )}
      </div>
    </div>
  );
};

export default Saved;
