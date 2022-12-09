import axios from "axios"
import { 
    GET_USER,
    GET_USER_SUCCESS,
    GET_USER_ERROR,
    GET_ALL_CARTEGORIES,
    GET_ALL_CARTEGORIES_SUCCESS,
    GET_ALL_CARTEGORIES_ERROR,
    ADD_POST,
    ADD_POST_SUCCESS,
    ADD_POST_ERROR,
    GET_ALL_POSTS,
    GET_ALL_POSTS_SUCCESS,
    GET_ALL_POSTS_ERROR,
} from "../types";



export function addNewFilePostAction(formData){
    return async() => {
        try {
            await axios.post('http://localhost:4000/api/post/uploads-post', formData);
        } catch (error) {
            console.log(error);

        }
    }
}

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

