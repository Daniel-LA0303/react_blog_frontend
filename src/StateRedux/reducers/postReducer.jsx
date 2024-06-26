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
    GET_PAGE_HOME_POSTS_CATS_ERROR,
    GET_PAGE_HOME_POSTS_CATS,
    GET_PAGE_HOME_POSTS_CATS_SUCCESS,
    GET_PAGE_POST_BY_CATEGORY_SUCCESS,
    GET_PAGE_POST_BY_CATEGORY_ERROR,
    GET_PAGE_POST_BY_CATEGORY,
    GET_PAGE_DASHBOARD,
    GET_PAGE_DASHBOARD_ERROR,
    GET_PAGE_DASHBOARD_SUCCESS,
    GET_PAGE_DASHBOARD_LIKE_POST_USER,
    GET_PAGE_DASHBOARD_LIKE_POST_USER_ERROR,
    GET_PAGE_DASHBOARD_LIKE_POST_USER_SUCCESS,
    GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER,
    GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER_ERROR,
    GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER_SUCCESS,
    GET_PAGE_DASHBOARD_SAVED_POST_USER_SUCCESS,
    GET_PAGE_DASHBOARD_SAVED_POST_USER_ERROR,
    GET_PAGE_DASHBOARD_SAVED_POST_USER,
    GET_PAGE_DASHBOARD_TAGS_USER_ERROR,
    GET_PAGE_DASHBOARD_TAGS_USER,
    GET_PAGE_DASHBOARD_TAGS_USER_SUCCESS,
    GET_PAGE_PROFILE_USER_SUCCESS,
    GET_PAGE_PROFILE_USER_ERROR,
    GET_PAGE_PROFILE_USER,
    GET_PAGE_NEW_POST_ERROR,
    GET_PAGE_NEW_POST,
    GET_PAGE_NEW_POST_SUCCESS,
    GET_PAGE_DASHBOARD_POSTS_USER,
    GET_PAGE_DASHBOARD_POSTS_USER_ERROR,
    GET_PAGE_DASHBOARD_POSTS_USER_SUCCESS,
} from "../types";

const initialState = {
    linkBaseBackend: 'http://localhost:4000/api', 
    alertMSG:{},
    msgPost:{},
    token: JSON.parse(localStorage.getItem("token")) || null,
    themeW: JSON.parse(localStorage.getItem("theme")) || null,
    /**
     * User Auth we need this user for the login and register
     */
    userAuth:{}, 
    user: {},
    // userView:{},
    // posts:[],
    // post:{},
    comments:[],
    categories:[],

    /**
     * Categories for the home page
     */
    categoriesHome:[],
    category: {},
    error: null,
    errorPost: null,
    loading: false, //-> loading for the loadding pages
    loadingUser: false, //-> loading for the user
    errorUser: null, //-> error for the user
    loadingPost: false,
    PFLink: 'http://localhost:4000/uploads-profile/',
    PFPost: 'http://localhost:4000/uploads-post/',

    /**
     * PAGES
     */
    pageHome: {},
    pageCategoryByPost: {},
    pageDashboard: {},
    pageDashboardLikePostUser: {},
    pagesDashboardFollowedFollowersUser: {},
    pageSavedPostUser: {},
    pageTagsUser: {},
    pagePostUser: {},
    /**
     * 
     */
    pageProfileUser: {},
    pageNewPost: {}
}


export default function(state = initialState, action){
    switch(action.type){
        // case RESET_STATE_POST :
        //     return{
        //         ...state,
        //         post: {},
        //         userView: {},
        //         // user: {}
        //     }
        case GET_USER:
            return{
                ...state,
                loadingUser: action.payload
            }
        case GET_USER_ERROR:
            return{
                ...state,
                loadingUser: false,
                errorUser: action.payload
            }
        case GET_USER_SUCCESS:
            return{
                ...state,
                loadingUser: false,
                errorUser: null,
                user: action.payload
            }
        case GET_ALL_CARTEGORIES:
        case GET_PAGE_HOME_POSTS_CATS:
        case GET_PAGE_POST_BY_CATEGORY:
        case GET_PAGE_DASHBOARD:
        case GET_PAGE_DASHBOARD_LIKE_POST_USER:
        case GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER:
        case GET_PAGE_DASHBOARD_SAVED_POST_USER:
        case GET_PAGE_DASHBOARD_TAGS_USER:
        case GET_PAGE_PROFILE_USER:
        case GET_PAGE_NEW_POST:
        case GET_PAGE_DASHBOARD_POSTS_USER:
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
        case GET_PAGE_HOME_POSTS_CATS_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                pageHome: action.payload
            }
        case GET_PAGE_POST_BY_CATEGORY_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                pageCategoryByPost: action.payload
            }
        case GET_PAGE_DASHBOARD_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                pageDashboard: action.payload
            }
        case GET_PAGE_DASHBOARD_LIKE_POST_USER_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                pageDashboardLikePostUser: action.payload
            }
        case GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                pagesDashboardFollowedFollowersUser: action.payload
            }
        case GET_PAGE_DASHBOARD_SAVED_POST_USER_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                pageSavedPostUser: action.payload
            }
        case GET_PAGE_DASHBOARD_TAGS_USER_SUCCESS:
                return{
                    ...state,
                    loading: false,
                    error: null,
                    pageTagsUser: action.payload
                }
        case GET_PAGE_DASHBOARD_POSTS_USER_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                pagePostUser: action.payload
            }
        case GET_PAGE_PROFILE_USER_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                pageProfileUser: action.payload
            }
        case GET_PAGE_NEW_POST_SUCCESS:
            return{
                ...state,
                loading: false,
                error: null,
                pageNewPost: action.payload
            }
        case ADD_POST:
            return{
                ...state,
                loadingPost: action.payload
            }
        case ADD_POST_SUCCESS:
            return{
                ...state,
                loadingPost: false,
                msgPost: action.payload
            }
        case ADD_POST_ERROR:
            return{
                ...state,
                loadingPost: false,
                errorPost: action.payload
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
        case GET_ALL_CARTEGORIES_ERROR:
        case GET_PAGE_HOME_POSTS_CATS_ERROR:
        case GET_PAGE_POST_BY_CATEGORY_ERROR:
        case GET_PAGE_DASHBOARD_ERROR:
        case GET_PAGE_DASHBOARD_LIKE_POST_USER_ERROR:
        case GET_PAGE_DASHBOARD_FOLLOWED_FOLLOWERS__USER_ERROR:
        case GET_PAGE_DASHBOARD_SAVED_POST_USER_ERROR:
        case GET_PAGE_DASHBOARD_TAGS_USER_ERROR:
        case GET_PAGE_DASHBOARD_POSTS_USER_ERROR:
        case GET_PAGE_PROFILE_USER_ERROR:
        case GET_PAGE_NEW_POST_ERROR:
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