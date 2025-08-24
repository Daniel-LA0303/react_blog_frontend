

import { useSwal } from '../../hooks/useSwal.js';
import clientAuthAxios from '../../services/clientAuthAxios.js';
import { 
    EDIT_USER, 
    EDIT_USER_ERROR, 
    EDIT_USER_SUCCESS, 
    NEW_POST_SUCCESS 
} from '../types/index.jsx';

const { showAutoSwal, showConfirmSwal } = useSwal();

const editUser = () => ({ type: EDIT_USER});

const editUserSuccess = (user, message) => ({
    type: EDIT_USER_SUCCESS,
    payload: {data: user, message}
});

const editUserError = (error) => ({
    type: EDIT_USER_ERROR,
    payload: error
});

export function editUserAction(userId, editUserData, route){
    return async (dispatch) => {

        // 1. diapatch edit user action
        dispatch(editUser());

        try {
            
            // 2. edit user 
            const response = await clientAuthAxios.post(`/users/new-info/${userId}`, editUserData);

            dispatch(editUserSuccess(response.data.data || null, response.data.message));

            // 4. Show success message
            showAutoSwal({ 
                message: response.data.message, 
                status: "success", 
                timer: 2000       
            });

            setTimeout(() => {
                route(`/profile/${userId}`);
            }, 500);

        } catch (error) {

            // 5. get error message
            const msg = error.response?.data?.message || "Error inesperado";
            
            // 6. Dispatch error action
            dispatch(editUserError(msg));

            // 7. Show error message
            showConfirmSwal({ 
                message: msg, 
                status: "error", 
                confirmButton: true 
            });

            // we don't redirect here
        }
    }
}