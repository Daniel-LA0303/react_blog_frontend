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
    CHANGE_THEME
} from "../types";

// export function resetStatePostAction(){
//     return (dispatch) => {
//         dispatch(resetStatePost());
//     }       
// }

// const resetStatePost = () => ({
//     type: RESET_STATE_POST
// });

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

//users
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
            const res = await axios.get('http://localhost:4000/api/users/profile', config);
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
            const res = await axios.get(`http://localhost:4000/api/users/get-profile/${id}`);
            // console.log(res.data);
            
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


//categories
export function getAllCategoriesAction(){
    return async(dispatch) => {
        dispatch(getAllCategories());
        try {
            const res = await axios.get('http://localhost:4000/api/categories');
            
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
            const res = await axios.get('http://localhost:4000/api/posts');
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
            const res = await axios.get(`http://localhost:4000/api/posts/${id}`);
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
export function addNewPostAction(newPost){
    return async (dispatch) => {
        dispatch(addNewPost());
        try {
            await axios.post('http://localhost:4000/api/posts', newPost);
            dispatch(addNewPostSuccess(newPost)); 
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

const addNewPostSuccess = newPost => ({
    type: ADD_POST_SUCCESS,
    payload: newPost
});

const addNewPostError = (stateError) => ({
    type: ADD_POST_ERROR,
    payload: stateError
});

//edit post
export function editPostAction(id, newPost){
    return async(dispatch) => {
        dispatch(editPost());
        try {
            const res = await axios.put(`http://localhost:4000/api/posts/${id}`, newPost);
            dispatch(editPostSuccess(res));
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
            const res = await axios.delete(`http://localhost:4000/api/posts/${id}`).then(res =>{
                Swal.fire(
                    'The product has been removed',
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

//reset state
export function resetStatePostAction(){
    return (dispatch) => {
        dispatch(resetStatePost());
    }       
}

const resetStatePost = () => ({
    type: RESET_STATE_POST
});


//files
export function addNewFilePostAction(formData){
    return async() => {
        try {
            await axios.post('http://localhost:4000/api/post/uploads-post', formData);
        } catch (error) {
            console.log(error);

        }
    }
}

export function addNewFileUserAction(formData){
    return async() => {
        try {
            await axios.post('http://localhost:4000/api/users/uploads-profile', formData);
        } catch (error) {
            console.log(error);

        }
    }
}

