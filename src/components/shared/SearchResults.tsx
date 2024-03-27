import { Models } from "appwrite";
import { Loader } from "lucide-react";
import GridPostList from "./GridPostList";

type SearchedResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document;
};

const SearchResults = ({
  isSearchFetching,
  searchedPosts,
}: SearchedResultsProps) => {
  if (isSearchFetching) return <Loader />;

  if (searchedPosts?.documents.length > 0)
    return <GridPostList posts={searchedPosts?.documents} />;
  return (
    <p className="text-light-e mt-10 text-center w-full">No Results Found</p>
  );
};

export default SearchResults;
