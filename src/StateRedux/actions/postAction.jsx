import axios from "axios"
import Swal from "sweetalert2";
import { 
    GET_USER,
    GET_USER_SUCCESS,
    GET_USER_ERROR,
    GET_ONE_USER,
    GET_ONE_USER_SUCCESS,
    GET_ONE_USER_ERROR,
    GET_ALL_CARTEGORIES,
    GET_ALL_CARTEGORIES_SUCCESS,
    GET_ALL_CARTEGORIES_ERROR,
    ADD_POST,
    ADD_POST_SUCCESS,
    ADD_POST_ERROR,
    GET_ALL_POSTS,
    GET_ALL_POSTS_SUCCESS,
    GET_ALL_POSTS_ERROR,
    GET_ONE_POST,
    GET_ONE_POST_SUCCESS,
    GET_ONE_POST_ERROR,
    EDIT_POST,
    EDIT_POST_SUCCESS,
    EDIT_POST_ERROR,
    DELETE_POST,
    DELETE_POST_SUCCESS,
    DELETE_POST_ERROR,
    RESET_STATE_POST,
    CHANGE_THEME,
    ALERT_ON,
    ALERT_OFF,
    GET_COMMENTS,
    EDIT_COMMENT,
    DELETE_COMMENT,
    NEW_COMMENT,
    GET_ALL_CARTEGORIES_HOME,
    GET_ALL_CARTEGORIES_HOME_SUCCESS,
    GET_ALL_CARTEGORIES_HOME_ERROR,
    GET_PAGE_HOME_POSTS_CATS,
    GET_PAGE_HOME_POSTS_CATS_SUCCESS,
    GET_PAGE_HOME_POSTS_CATS_ERROR,
    GET_PAGE_POST_BY_CATEGORY,
    GET_PAGE_POST_BY_CATEGORY_SUCCESS,
    GET_PAGE_POST_BY_CATEGORY_ERROR,
    GET_PAGE_DASHBOARD,
    GET_PAGE_DASHBOARD_SUCCESS,
    GET_PAGE_DASHBOARD_ERROR,
    GET_PAGE_DASHBOARD_LIKE_POST_USER,
    GET_PAGE_DASHBOARD_LIKE_POST_USER_SUCCESS,
    GET_PAGE_DASHBOARD_LIKE_POST_USER_ERROR,
    GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER_ERROR,
    GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER_SUCCESS,
    GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER,
    GET_PAGE_DASHBOARD_SAVED_POST_USER,
    GET_PAGE_DASHBOARD_SAVED_POST_USER_SUCCESS,
    GET_PAGE_DASHBOARD_SAVED_POST_USER_ERROR,
    GET_PAGE_DASHBOARD_TAGS_USER_ERROR,
    GET_PAGE_DASHBOARD_TAGS_USER_SUCCESS,
    GET_PAGE_DASHBOARD_TAGS_USER,
} from "../types";
import Categories from "../../Pages/Categories/Categories";

// export function resetStatePostAction(){
//     return (dispatch) => {
//         dispatch(resetStatePost());
//     }       
// }

// const resetStatePost = () => ({
//     type: RESET_STATE_POST
// });

//*** 
export function alertOnAction(alertMSG){
    // console.log('theme');
    return (dispatch) => {
        dispatch(alertOn(alertMSG));
        // console.log('theme');
    }
}
const alertOn = (alertMSG) => ({
    type: ALERT_ON,
    payload: alertMSG
})

export function alertOffAction(){
    // console.log('theme');
    return (dispatch) => {
        dispatch(alertOff());
        // console.log('theme');
    }
}
const alertOff = () => ({
    type: ALERT_OFF
})

//*** 
export function changeThemeAction(){
    // console.log('theme');
    return (dispatch) => {
        dispatch(changeTheme());
        // console.log('theme');
    }
}
const changeTheme = () => ({
    type: CHANGE_THEME
})

/**
 * Function to get user form the service
 * 
 * @param {*} token 
 * @returns 
 */
export function getUserAction(token){
    return async(dispatch) => {

        /**
         * Dispatch the user GET_USER
         */
        dispatch(getUser());
        
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/users/profile`, config);
            
            /**
             * Dispatch the user to the state
             */
            dispatch(getUserSuccess(res.data));
        } catch (error) {
            /**
             * Dispatch the error to the state
             */
            console.log(error);
            dispatch(getUserError(true));
        }
    }
}

/**
 * 
 * @returns null
 */
const getUser = () => ({
    type: GET_USER,
    payload: true
});
const getUserSuccess = (data) => ({
    type: GET_USER_SUCCESS,
    payload: data
});
const getUserError = (stateError) => ({
    type: GET_USER_ERROR,
    payload: stateError
});

export function getOneUserAction(id){
    return async(dispatch) => {
        dispatch(getOneUser());
        
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/users/get-profile/${id}`);            
            dispatch(getOneUserSuccess(res.data));
        } catch (error) {
            console.log(error);
            dispatch(getOneUserError(true));
        }
    }
}

const getOneUser = () => ({
    type: GET_ONE_USER,
    payload: true
});

const getOneUserSuccess = (data) => ({
    type: GET_ONE_USER_SUCCESS,
    payload: data
});

const getOneUserError = (stateError) => ({
    type: GET_ONE_USER_ERROR,
    payload: stateError
});


/**
 ********** Actions Categories *******
 */
export function getAllCategoriesAction(){
    return async(dispatch) => {
        dispatch(getAllCategories());
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-categories`);
            console.log(res.data.categories);
            dispatch(getAllCategoriesSuccess(res.data.categories));
        } catch (error) {
            console.log(error);
            dispatch(getAllCategoriesError(true));
        }
    }
}
const getAllCategories = () => ({
    type: GET_ALL_CARTEGORIES,
    payload: true
});
const getAllCategoriesSuccess = (data) => ({
    type: GET_ALL_CARTEGORIES_SUCCESS,
    payload: data
});
const getAllCategoriesError = (stateError) => ({
    type: GET_ALL_CARTEGORIES_ERROR,
    payload: stateError
});

/**
 * This Action is to get all categories for the home page
 * 
 */
export function getAllCategoriesHomeAction(){
    return async(dispatch) => {
        dispatch(getAllCategoriesHome());
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/categories`);
            
            dispatch(getAllCategoriesHomeSuccess(res.data));
        } catch (error) {
            console.log(error);
            dispatch(getAllCategoriesHomeError(true));
        }
    }
}
const getAllCategoriesHome = () => ({
    type: GET_ALL_CARTEGORIES_HOME,
    payload: true
});
const getAllCategoriesHomeSuccess = (data) => ({
    type: GET_ALL_CARTEGORIES_HOME_SUCCESS,
    payload: data
});
const getAllCategoriesHomeError = (stateError) => ({
    type: GET_ALL_CARTEGORIES_HOME_ERROR,
    payload: stateError
});

//posts
//get all posts
export function getAllPostsAction(){
    return async(dispatch) => {
        dispatch(getAllPosts());
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/posts`);
            dispatch(getAllPostsSuccess(res.data));
        } catch (error) {
            console.log(error);
            dispatch(getAllPostsError())
        }
    }
}
const getAllPosts = () =>({
    type: GET_ALL_POSTS,
    payload: true
});
const getAllPostsSuccess = (posts) => ({
    type: GET_ALL_POSTS_SUCCESS,
    payload: posts
});
const getAllPostsError =() => ({
    type: GET_ALL_POSTS_ERROR,
    payload: true
});


//get one post
export function getOnePostAction(id){
    return async(dispatch) => {
        dispatch(getOnePost());
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/posts/${id}`);
            dispatch(getOnePostSuccess(res.data));
        } catch (error) {
            console.log(error);
            dispatch(getOnePostError())
        }
    }
}
const getOnePost = () =>({
    type: GET_ONE_POST,
    payload: true
});
const getOnePostSuccess = (post) => ({
    type: GET_ONE_POST_SUCCESS,
    payload: post
});
const getOnePostError =() => ({
    type: GET_ONE_POST_ERROR,
    payload: true
});

//New post
export function addNewPostAction(newPost, newPostRedux){
    return async (dispatch) => {
        dispatch(addNewPost());
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/posts`, newPost);
            Swal.fire(
                res.data.msg,
                // 'You clicked the button!',
                'success'
              )
            dispatch(addNewPostSuccess(newPostRedux)); 
        } catch (error) {
            console.log(error);
            dispatch(addNewPostError(true));
        }
    }
}
const addNewPost = () => ({
    type: ADD_POST,
    payload: true
});

const addNewPostSuccess = newPostRedux => ({
    type: ADD_POST_SUCCESS,
    payload: newPostRedux
});

const addNewPostError = (stateError) => ({
    type: ADD_POST_ERROR,
    payload: stateError
});

//edit post
export function editPostAction(id, postUpdate , postUpdateRedux){
    return async(dispatch) => {
        dispatch(editPost());
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL_BACKEND}/posts/${id}`, postUpdate).then(res =>{
                Swal.fire(
                    res.data.msg,
                    // res.data.mensaje,
                    'success'
                )
            });;
            // console.log(res);
            dispatch(editPostSuccess(postUpdateRedux));
        } catch (error) {
            console.log(error);
            dispatch(editPostError());
        }
    }
}

const editPost = () => ({
    type: EDIT_POST,
    payload: true
});

const editPostSuccess = (post) => ({
    type: EDIT_POST_SUCCESS,
    payload: post
});

const editPostError = () => ({
    type: EDIT_POST_ERROR,
    payload: true
});

//delete post
export function deletePostAction(id){
    return async(dispatch) => {
        dispatch(deletePost());
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL_BACKEND}/posts/${id}`).then(res =>{
                Swal.fire(
                    res.data.msg,
                    // res.data.mensaje,
                    'success'
                )
            });
            dispatch(deletePostSuccess(id));
        } catch (error) {
            console.log(error);
            dispatch(deletePostError());
        }
    }
}

const deletePost = () => ({
    type: DELETE_POST,
    payload: true
});

const deletePostSuccess = (id) => ({
    type: DELETE_POST_SUCCESS,
    payload: id
});

const deletePostError = () => ({
    type: DELETE_POST_ERROR,
    payload: true
});

//COMMENTS ***
export function getCommentsAction(comments){
    return async(dispatch) => {
        dispatch(getComments(comments));
        
    }
}
const getComments = (comments) => ({
    type: GET_COMMENTS,
    payload: comments
});
export function newCommentAction(comment){
    return async(dispatch) => {
        dispatch(newComment(comment));
        
    }
}
const newComment = (comment) => ({
    type: NEW_COMMENT,
    payload: comment
});
export function editCommentAction(comment){
    return async(dispatch) => {
        dispatch(editComment(comment));
        // console.log(comment);
    }
}
const editComment = (comment) => ({
    type: EDIT_COMMENT,
    payload: comment
});
export function deleteCommentAction(id){
    return async(dispatch) => {
        dispatch(deleteComment(id));
        console.log(id);
    }
}
const deleteComment = (id) => ({
    type: DELETE_COMMENT,
    payload: id
});


/**DELETE THIS */
//reset state ***
export function resetStatePostAction(){
    return (dispatch) => {
        dispatch(resetStatePost());
    }       
}
const resetStatePost = () => ({
    type: RESET_STATE_POST
});
/*** */


//files ***
export function addNewFilePostAction(formData){
    return async() => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/post/uploads-post`, formData);
        } catch (error) {
            console.log(error);
        }
    }
}
export function addNewFileUserAction(formData){
    return async() => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL_BACKEND}/users/uploads-profile`, formData);
        } catch (error) {
            console.log(error);

        }
    }
}


/**
 * PAGES
 */

/**
 * State page home
 * @returns 
 */
export function getPageHomeAction(){
    return async (dispatch) => {
        dispatch(getPageHome());
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-home`);
            dispatch(getPageHomeSuccess(res.data)); 
        } catch (error) {
            console.log(error);
            dispatch(getPageHomeError(true));
        }
    }
}
const getPageHome = () => ({
    type: GET_PAGE_HOME_POSTS_CATS,
    payload: true
});

const getPageHomeSuccess = newPostRedux => ({
    type: GET_PAGE_HOME_POSTS_CATS_SUCCESS,
    payload: newPostRedux
});

const getPageHomeError = (stateError) => ({
    type: GET_PAGE_HOME_POSTS_CATS_ERROR,
    payload: stateError
});


/**
 * State page post by category
 * @param {*} id 
 * @returns 
 */
export function getPagePostByCategoryAction(id){
    return async (dispatch) => {
        dispatch(getPagePostByCategory());
        try {
            
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-category-post/${id}`);
            dispatch(getPagePostByCategorySuccess(res.data)); 
        } catch (error) {
            console.log(error);
            dispatch(getPagePostByCategoryError(true));
        }
    }
}
const getPagePostByCategory = () => ({
    type: GET_PAGE_POST_BY_CATEGORY,
    payload: true
});

const getPagePostByCategorySuccess = newPostRedux => ({
    type: GET_PAGE_POST_BY_CATEGORY_SUCCESS,
    payload: newPostRedux
});

const getPagePostByCategoryError = (stateError) => ({
    type: GET_PAGE_POST_BY_CATEGORY_ERROR,
    payload: stateError
});

/**
 * State page dashboard
 * @param {*} id 
 * @returns 
 */
export function getPageDasboardAction(id){
    return async (dispatch) => {
        dispatch(getPageDasboard());
        try {  
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard/${id}`);
            dispatch(getPageDasboardSuccess(res.data)); 
        } catch (error) {
            console.log(error);
            dispatch(getPageDasboardError(true));
        }
    }
}
const getPageDasboard = () => ({
    type: GET_PAGE_DASHBOARD,
    payload: true
});

const getPageDasboardSuccess = newPostRedux => ({
    type: GET_PAGE_DASHBOARD_SUCCESS,
    payload: newPostRedux
});

const getPageDasboardError = (stateError) => ({
    type: GET_PAGE_DASHBOARD_ERROR,
    payload: stateError
});


/**
 * State page dashboard like post by user
 * @param {*} id 
 * @returns 
 */
export function getPageDasboardLikePostUserAction(id){
    return async (dispatch) => {
        dispatch(getPageDasboardLikePostUser());
        try {  
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard-liked-post-user/${id}`);
            dispatch(getPageDasboardLikePostUserSuccess(res.data)); 
        } catch (error) {
            console.log(error);
            dispatch(getPageDasboardLikePostUserError(true));
        }
    }
}
const getPageDasboardLikePostUser = () => ({
    type: GET_PAGE_DASHBOARD_LIKE_POST_USER,
    payload: true
});

const getPageDasboardLikePostUserSuccess = newPostRedux => ({
    type: GET_PAGE_DASHBOARD_LIKE_POST_USER_SUCCESS,
    payload: newPostRedux
});

const getPageDasboardLikePostUserError = (stateError) => ({
    type: GET_PAGE_DASHBOARD_LIKE_POST_USER_ERROR,
    payload: stateError
});

/**
 * State page dashboard we get follwers and followed
 * @param {*} id 
 * @returns 
 */
export function getPageDasboardFollowtUserAction(id){
    return async (dispatch) => {
        dispatch(getPageDasboardFollowtUser());
        try {  
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard-follow-user/${id}`);
            dispatch(getPageDasboardFollowtUserSuccess(res.data)); 
        } catch (error) {
            console.log(error);
            dispatch(getPageDasboardFollowtUserError(true));
        }
    }
}
const getPageDasboardFollowtUser = () => ({
    type: GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER,
    payload: true
});

const getPageDasboardFollowtUserSuccess = newPostRedux => ({
    type: GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER_SUCCESS,
    payload: newPostRedux
});

const getPageDasboardFollowtUserError = (stateError) => ({
    type: GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER_ERROR,
    payload: stateError
});

/**
 * State page saved post buy user
 * @param {*} id 
 * @returns 
 */
export function getPageDasboardSavedPostUserAction(id){
    return async (dispatch) => {
        dispatch(getPageDasboardSavedPostUser());
        try {  
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard-saved-post-user/${id}`);
            dispatch(getPageDasboardSavedPostUserSuccess(res.data)); 
        } catch (error) {
            console.log(error);
            dispatch(getPageDasboardSavedPostUserError(true));
        }
    }
}
const getPageDasboardSavedPostUser = () => ({
    type: GET_PAGE_DASHBOARD_SAVED_POST_USER,
    payload: true
});

const getPageDasboardSavedPostUserSuccess = newPostRedux => ({
    type: GET_PAGE_DASHBOARD_SAVED_POST_USER_SUCCESS,
    payload: newPostRedux
});

const getPageDasboardSavedPostUserError = (stateError) => ({
    type: GET_PAGE_DASHBOARD_SAVED_POST_USER_ERROR,
    payload: stateError
});

/**
 * State page tags by user
 * @param {*} id 
 * @returns 
 */
export function getPageDasboardTagsUserAction(id){
    return async (dispatch) => {
        dispatch(getPageDasboardTagsUser());
        try {  
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/pages/page-dashboard-tag-use/${id}`);
            dispatch(getPageDasboardTagsUserSuccess(res.data)); 
        } catch (error) {
            console.log(error);
            dispatch(getPageDasboardTagsUserError(true));
        }
    }
}
const getPageDasboardTagsUser = () => ({
    type: GET_PAGE_DASHBOARD_TAGS_USER,
    payload: true
});

const getPageDasboardTagsUserSuccess = newPostRedux => ({
    type: GET_PAGE_DASHBOARD_TAGS_USER_SUCCESS,
    payload: newPostRedux
});

const getPageDasboardTagsUserError = (stateError) => ({
    type: GET_PAGE_DASHBOARD_TAGS_USER_ERROR,
    payload: stateError
});