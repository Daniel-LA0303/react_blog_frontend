import {combineReducers} from 'redux';
// import productosReducer from './productosReducer';
import postReducer from './postReducer';
import postsReducers from './postsReducers';

export default combineReducers({
    posts: postReducer,
    postState: postsReducers // -> post state
})