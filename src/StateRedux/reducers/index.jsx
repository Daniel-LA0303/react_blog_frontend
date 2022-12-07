import {combineReducers} from 'redux';
// import productosReducer from './productosReducer';
import postReducer from './postReducer';

export default combineReducers({
    posts: postReducer
})