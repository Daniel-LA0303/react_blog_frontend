import { 
    GET_USER,
    GET_USER_SUCCESS,
    GET_USER_ERROR,
} from "../types";

const initialState = {
    token: JSON.parse(localStorage.getItem("token")) || null,
    user: {},
    posts:[],
    post:{},
    categories:[],
    error: null,
    loading: false,
    PFLink: 'http://localhost:4000/uploads-profile/'
}


export default function(state = initialState, action){
    switch(action.type){
        case GET_USER:
            return{
                ...state,
                loading: action.payload
            }
        case GET_USER_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                user: action.payload
            }
        case GET_USER_ERROR:
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        default: return state;
    }
}