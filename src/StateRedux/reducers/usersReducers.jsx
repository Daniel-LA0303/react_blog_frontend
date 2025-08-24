import { 
    EDIT_USER, 
    EDIT_USER_ERROR, 
    EDIT_USER_SUCCESS 
} from '../types/index.jsx';

const initialState = {
    loading: false,
    error: null,
    userResponse: null,
    message: null
};


export default function usersReducers(state = initialState, action) {
    switch (action.type) {
        case EDIT_USER: 
            return{
                ...state,
                loading: true,
                error: null,
                message: null,
            };
        case EDIT_USER_SUCCESS:
            return{
                ...state,
                loading: false,
                userResponse: action.payload.data,
                message: action.payload.message,
                error: null
            };
        case EDIT_USER_ERROR:
            return{
                ...state,
                loading: false,
                error: action.payload.error,
                message: null
            };
        default:
            return state;
    }
}