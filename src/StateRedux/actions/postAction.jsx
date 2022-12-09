import axios from "axios"
import { 
    GET_USER,
    GET_USER_SUCCESS,
    GET_USER_ERROR,
} from "../types";


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
})
