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

const initialState = {
    linkBaseBackend: import.meta.env.VITE_API_URL_BACKEND, 
    alertMSG:{},
    token: JSON.parse(localStorage.getItem("token")) || null,
    themeW: JSON.parse(localStorage.getItem("theme")) || null,
    user: {},
    userView:{},
    posts:[],
    post:{},
    comments:[],
    categories:[],
    category: {},
    error: null,
    loading: false,
    PFLink: 'http://localhost:4000/uploads-profile/',
    PFPost: 'http://localhost:4000/uploads-post/'
}


export default function(state = initialState, action){
    switch(action.type){
        case RESET_STATE_POST :
            return{
                ...state,
                post: {},
                userView: {},
                // user: {}
            }
        case GET_USER:
        case GET_ALL_CARTEGORIES:
        case ADD_POST:
        case GET_ALL_POSTS:
        case GET_ONE_POST:
        case GET_ONE_USER:
        case EDIT_POST:
        case DELETE_POST:  
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
        case EDIT_POST_SUCCESS:
            return{
                ...state,
                posts:state.posts.map(post => 
                    post._id === action.payload._id ? post = action.payload : post),
                post: {}
            }
        case DELETE_POST_SUCCESS:
            return {
                ...state,
                posts: state.posts.filter(post => post._id !== action.payload),
                post: {}
            }
        case GET_USER_ERROR:
        case GET_ALL_CARTEGORIES_ERROR:
        case ADD_POST_ERROR:
        case GET_ALL_POSTS_ERROR:
        case GET_ONE_POST_ERROR:
        case GET_ONE_USER_ERROR:
        case EDIT_POST_ERROR:
        case DELETE_POST_ERROR:
            return{
                ...state,
                loading: false,
                error: action.payload
            }
        case CHANGE_THEME:
            return{
                ...state,
                themeW: !state.themeW
            }
        case ALERT_ON:
            return{
                ...state,
                alertMSG: action.payload
            }
        case ALERT_OFF:
            return{
                ...state,
                alertMSG: {}
            }
        case GET_COMMENTS:
            return{
                ...state,
                comments: action.payload
            }
    
        case NEW_COMMENT:
            return{
                ...state,
                comments: [...state.comments, action.payload]
            }
        case EDIT_COMMENT:
            return{
                ...state,
                comments: state.comments.map(comment => 
                    comment._id === action.payload._id ? comment = action.payload : comment),
            }
        case DELETE_COMMENT:
            return {
                ...state,
                comments: state.comments.filter(comment => comment.dateComment !== action.payload),
            }
        
        default: return state;
    }
}