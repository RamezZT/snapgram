import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { createUserAccount, getCurrentUser, signInAccount, signOutAccount } from "../appwrite/api";
import { INewUser, IUpdatePost } from "@/types";
import { createPost, deletePost, deleteSavedPost, getInfinitePosts, getPostById, getRecentPosts, getUserPosts, likePost, savePost, searchPosts, updatePost } from "../appwrite/adrianApi";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAcount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}
export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string; }) => signInAccount(user)
    })
}
export const useSignOutAccount = () => {
    return useMutation({ mutationFn: signOutAccount });
}
export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPost, onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] })
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID] })
        }
    });
}
export const useEditPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post), onSuccess: (post) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, post?.$id] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
        }
    });
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, imageId }: { postId: string, imageId: string }) => deletePost(postId, imageId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] }),
    })
}

export const useGetRecentPosts = () => {
    return useQuery({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS], queryFn: getRecentPosts });
}

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string, likesArray: string[] }) => likePost(postId, likesArray)
        , onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
        }
    });
}
export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string, userId: string }) => savePost(userId, postId)
        , onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
        }
    });
}
export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_CURRENT_USER] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_POSTS] });
        }
    });
}
export const useGetCurrentUser = () => {
    return useQuery({ queryKey: [QUERY_KEYS.GET_CURRENT_USER], queryFn: getCurrentUser });
}
export const useGetPostById = (id: string) => {
    return useQuery({ queryKey: [QUERY_KEYS.GET_POST_BY_ID, id], queryFn: () => getPostById(id), enabled: !!id });
}
export const useGetUserPosts = (id: string) => {
    return useQuery({ queryKey: [QUERY_KEYS.GET_USER_POSTS, id], queryFn: () => getUserPosts(id) })
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts as any,
        getNextPageParam: (lastPage: any) => {
            // If there's no data, there are no more pages.
            if (lastPage && lastPage.documents.length === 0) {
                return null;
            }

            // Use the $id of the last document as the cursor.
            const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
            return lastId;
        },
        initialPageParam: 0,
    });
};

export function useSearchPosts(searchTerm: string) {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: searchTerm !== "",
    });
}
