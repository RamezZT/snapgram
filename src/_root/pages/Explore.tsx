import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutations";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import GridPostList from "@/components/shared/GridPostList";
import SearchResults from "@/components/shared/SearchResults";
import { useInView } from "react-intersection-observer";
const Explore = () => {
  const [searchValue, setSearchValue] = useState("");
  const { ref, inView } = useInView();
  const debouncedSearch = useDebounce(searchValue, 300);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(
    debouncedSearch ? debouncedSearch : ""
  );
  const { data: posts, hasNextPage, fetchNextPage } = useGetPosts();
  useEffect(() => {
    if (inView && !searchValue) fetchNextPage();
  }, [searchValue, fetchNextPage, inView]);
  if (!posts)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  console.log(posts);
  const shouldShowSearchResults = debouncedSearch !== "";
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts.pages.every((item) => item.documents.length === 0);
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => {
              const { value } = e.target;
              setSearchValue(value);
            }}
          />
        </div>
      </div>

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList
              showStats={false}
              showUser={true}
              key={`page-${index}`}
              posts={item.documents}
            />
          ))
        )}
      </div>

      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
