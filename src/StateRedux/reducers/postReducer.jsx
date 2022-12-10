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
    RESET_STATE_POST
} from "../types";

const initialState = {
    token: JSON.parse(localStorage.getItem("token")) || null,
    user: {},
    userView:{},
    posts:[],
    post:{},
    categories:[],
    error: null,
    loading: false,
    PFLink: 'http://localhost:4000/uploads-profile/',
    PFPost: 'http://localhost:4000/uploads-post/'
}


export default function(state = initialState, action){
    switch(action.type){
        case GET_USER:
        case GET_ALL_CARTEGORIES:
        case ADD_POST:
        case GET_ALL_POSTS:
        case GET_ONE_POST:
        case GET_ONE_USER:
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
        case GET_ALL_CARTEGORIES_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                categories: action.payload
            }
        case ADD_POST_SUCCESS:
            return{
                ...state,
                loading: false,
                posts: [...state.posts, action.payload]
            }
        case GET_ALL_POSTS_SUCCESS: 
            return{
                ...state,
                loading: false,
                error: null,
                posts: action.payload
            }
        case GET_ONE_POST_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                post: action.payload,
            }
        case GET_ONE_USER_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                userView: action.payload,
            }
        case GET_USER_ERROR:
        case GET_ALL_CARTEGORIES_ERROR:
        case ADD_POST_ERROR:
        case GET_ALL_POSTS_ERROR:
        case GET_ONE_POST_ERROR:
        case GET_ONE_USER_ERROR:
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        case RESET_STATE_POST :
            return{
                ...state,
                post: {},
                userView: {},
                user: {}
            }
        default: return state;
    }
}