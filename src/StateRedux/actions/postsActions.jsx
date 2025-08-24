import Swal from 'sweetalert2';
import clientAuthAxios from '../../services/clientAuthAxios.js';
import {
    NEW_POST,
    NEW_POST_SUCCESS,
    NEW_POST_ERROR,
    DELETE_POST_ERROR,
    DELETE_POST_SUCCESS,
    DELETE_POST
} from '../types/index.jsx';
import { useSwal } from '../../hooks/useSwal.js';

const { showAutoSwal, showConfirmSwal } = useSwal();

// Action creators new post
const newPost = () => ({ type: NEW_POST });

const newPostSuccess = (post, message) => ({
    type: NEW_POST_SUCCESS,
    payload: { data: post, message },
});

const newPostError = (errorMsg) => ({
    type: NEW_POST_ERROR,
    payload: errorMsg,
});

// Create new post action
export function newPostAction(newPostData, route) {
    return async (dispatch) => {

        // 1. Dispatch new post action
        dispatch(newPost());

        try {

            // 2. Create post
            const response = await clientAuthAxios.post(`/posts`, newPostData);

            // 3. Dispatch success action
            dispatch(newPostSuccess(response.data.data || null, response.data.message));

            // 4. Show success message
            showAutoSwal({ 
                message: response.data.message, 
                status: "success", 
                timer: 2000       
            });

            setTimeout(() => {
                route('/');
            }, 500);


        } catch (error) {

            // 5. get error message
            const msg = error.response?.data?.message || "Error inesperado";

            // 6. Dispatch error action
            dispatch(newPostError(msg));

            // 7. Show error message
            showConfirmSwal({ 
                message: msg, 
                status: "error", 
                confirmButton: true 
            })

            // we don't redirect here

        }
    };
}

// Action to delete a post
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

export function deletePostAction(postId, userId){
    return async(dispatch) => {

        // 1. Dispatch delete post action
        dispatch(deletePost());
        try {

            // 2. Delete post
            await clientAuthAxios.delete(`/posts/${postId}?userId=${userId}`).then(res =>{
                // showAutoSwal({ 
                //     message: res.data.message, 
                //     status: "success", 
                //     timer: 2000       
                // });
            });

            // 3. Dispatch success action
            dispatch(deletePostSuccess(id));
        } catch (error) {

            // 4. in case of error
            console.log(error);
            dispatch(deletePostError());
        }
    }
}
