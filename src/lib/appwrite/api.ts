import { INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";
export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(ID.unique(), user.email, user.password, user.name)

        if (!newAccount) throw new Error

        const avatarUrl = avatars.getInitials(user.name)

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })

        return newUser
    } catch (error) {
        console.log(error)
        return error;
    }
}
export async function saveUserToDB(user: { accountId: string, email: string, name: string, imageUrl: URL, username?: string, }) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        return newUser;
    } catch (error) {
        console.log(error)
    }
}
export async function signInAccount(user: { email: string; password: string }) {
    try {
        return await account.createEmailSession(user.email, user.password)
    } catch (error) {
        console.log(error)
    }
}
export async function signOutAccount() {
    try {
        return await account.deleteSession("current");
    } catch (error) {
        console.log(error)
    }
}

export async function getCurrentUser() {
    try {
        //this function gives us the currently logged in user
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;
        //note that the account here is only used for verification so it doesn't have all the data
        //about the user so we will have to get the docuement from the database
        const currentUser = await
            databases.listDocuments(appwriteConfig.databaseId, appwriteConfig.userCollectionId, [Query.equal('accountId', currentAccount.$id)]);
        if (!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error)
        return null;
    }
}