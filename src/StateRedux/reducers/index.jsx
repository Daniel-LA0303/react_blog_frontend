import {combineReducers} from 'redux';
// import productosReducer from './productosReducer';
import postReducer from './postReducer';
import postsReducers from './postsReducers';
import usersReducers from './usersReducers';

export default combineReducers({
    posts: postReducer,
    postState: postsReducers, // -> post state
    userState: usersReducers, // -> user state
})