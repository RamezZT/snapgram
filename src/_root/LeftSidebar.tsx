import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  useCreatePost,
  useSignOutAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink, INewPost } from "@/types";
import { readImages } from "@/lib/utils";
import { ID } from "appwrite";
import { createPost } from "@/lib/appwrite/adrianApi";

const handleUploadAll = async (createPost, userId) => {
  // const path = "D:/New folder/ALL/wallpapers/";
  const images: string[] = await readImages();

  const uploadPost = async (imgBlob) => {
    const res = await fetch(imgBlob);
    const img = await res.blob();
    const imgUrl = URL.createObjectURL(img);
    try {
      // Fetch the image data from the blob URL
      const response = await fetch(imgUrl);
      const fileData = await response.blob();
      const file = new File([fileData], "image", { type: "image/jpeg" });
      // Create a FormData object to send the image data to the server
      // Create a document in your database with the uploaded image URL or other relevant data
      const post: INewPost = {
        userId: userId,
        caption: "caption",
        file: new Array<File>(file),
      };
      const postedPost = await createPost(post);
      console.log(postedPost);
      console.log("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  images.map((img) => uploadPost(img));
};

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { mutate: createPost } = useCreatePost();
  const { user } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [navigate, isSuccess]);
  // const img = fetch("D:/New folder/ALL/wallpapers/1")
  //   .then((res) => res.json())
  //   .then((data) => data);
  // console.log(img);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assests/icons/profile-placeholder.svg"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.name}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
                key={link.label}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
          <li className={`leftsidebar-link group `}>
            <button
              onClick={() => {
                handleUploadAll(createPost, user.id);
              }}
              className="flex gap-4 items-center p-4"
            >
              Upload all posts
            </button>
          </li>
        </ul>
      </div>
      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
