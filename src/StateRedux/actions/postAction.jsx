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
} from "../types";

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

//users ***
export function getUserAction(token){
    return async(dispatch) => {
        dispatch(getUser());
        
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
        // console.log(JSON.parse(token));
        // console.log(token);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/users/profile`, config);
            // console.log(res.data);
            
            dispatch(getUserSuccess(res.data));
        } catch (error) {
            console.log(error);
            dispatch(getUserError(true));
        }
    }
}
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


//categories ***
export function getAllCategoriesAction(){
    return async(dispatch) => {
        dispatch(getAllCategories());
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL_BACKEND}/categories`);
            
            dispatch(getAllCategoriesSuccess(res.data));
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
//reset state ***
export function resetStatePostAction(){
    return (dispatch) => {
        dispatch(resetStatePost());
    }       
}
const resetStatePost = () => ({
    type: RESET_STATE_POST
});
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

