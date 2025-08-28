import { createContext, useState } from "react";



const UserAuthContext = createContext();

const UserAuthProvider = ({ children }) => {

    const [userAuth, setUserAuth] = useState({
        userAuthToken: localStorage.getItem("tokenAuthUser"),
        username: localStorage.getItem("username"),
        profileImage: localStorage.getItem("profileImage"),
        email: localStorage.getItem("email"),
        userId: localStorage.getItem("userId"),
        themeGlobal: null,
        likePost: JSON.parse(localStorage.getItem("likePost") || '{"reactions":0,"posts":[]}'),
        postsSaved: JSON.parse(localStorage.getItem("postsSaved") || '{"saved":0,"posts":[]}'),
        followsTags: JSON.parse(localStorage.getItem("followsTags") || '{"countTags":0,"tags":[]}'),
        followersUsers: JSON.parse(localStorage.getItem("followersUsers") || '{"countFollowers":0,"followers":[]}'),
        followedUsers: JSON.parse(localStorage.getItem("followedUsers") || '{"countFollowed":0,"followed":[]}'),
    });

    const addPostToLikes = (postId) => {
        setUserAuth(prev => {
            const newState = {
                ...prev,
                likePost: {
                    reactions: prev.likePost.reactions + 1,
                    posts: [...prev.likePost.posts, postId]
                }
            };
            localStorage.setItem("likePost", JSON.stringify(newState.likePost));
            return newState;
        });
    };

    const removePostFromLikes = (postId) => {
        setUserAuth(prev => {
            const newPosts = prev.likePost.posts.filter(id => id !== postId);
            const newState = {
                ...prev,
                likePost: {
                    reactions: Math.max(0, prev.likePost.reactions - 1),
                    posts: newPosts
                }
            };
            localStorage.setItem("likePost", JSON.stringify(newState.likePost));
            return newState;
        });
    };

    const addPostToSaved = (postId) => {
        setUserAuth(prev => {
            const newState = {
                ...prev,
                postsSaved: {
                    saved: prev.postsSaved.saved + 1,
                    posts: [...prev.postsSaved.posts, postId]
                }
            };
            localStorage.setItem("postsSaved", JSON.stringify(newState.postsSaved));
            return newState;
        });
    };

    const removePostFromSaved = (postId) => {
        setUserAuth(prev => {
            const newPosts = prev.postsSaved.posts.filter(id => id !== postId);
            const newState = {
                ...prev,
                postsSaved: {
                    saved: Math.max(0, prev.postsSaved.saved - 1),
                    posts: newPosts
                }
            };
            localStorage.setItem("postsSaved", JSON.stringify(newState.postsSaved));
            return newState;
        });
    };

    return (
        <UserAuthContext.Provider value={{
            userAuth,
            setUserAuth,
            addPostToLikes,
            addPostToSaved,
            removePostFromLikes,
            removePostFromSaved,
        }}>
            {children}
        </UserAuthContext.Provider>
    )

}

export { UserAuthProvider };
export default UserAuthContext;