import Swal from 'sweetalert2';
import clientAuthAxios from '../../services/clientAuthAxios.js';
import {
    NEW_POST,
    NEW_POST_SUCCESS,
    NEW_POST_ERROR
} from '../types/index.jsx';

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
export function newPostAction(newPostData) {
    return async (dispatch) => {

        // 1. Dispatch new post action
        dispatch(newPost());

        try {

            // 2. Create post
            const response = await clientAuthAxios.post(`/posts`, newPostData);

            // 3. Dispatch success action
            dispatch(newPostSuccess(response.data.data || null, response.data.message));

            // 4. Show success message
            Swal.fire({
                title: response.data.message,
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'swal-popup-success',
                    title: 'swal-title-success',
                    confirmButton: 'swal-btn-success'
                },
                buttonsStyling: false, 
            });

            setTimeout(() => route("/"), 500);

        } catch (error) {

            // 5. get error message
            const msg = error.response?.data?.message || "Error inesperado";

            // 6. Dispatch error action
            dispatch(newPostError(msg));

            // 7. Show error message
            Swal.fire({
                title: msg,
                text: "Status " + error.response?.status,
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'swal-popup-error',
                    title: 'swal-title-error',
                    confirmButton: 'swal-btn-error'
                },
                buttonsStyling: false,
            });

        }
    };
}
