import {
    NEW_POST,
    NEW_POST_SUCCESS,
    NEW_POST_ERROR
} from '../types/index.jsx';

const initialState = {
    loading: false,
    error: null,
    postResponse: null,
    message: null
}

export default function postsReducers(state = initialState, action) {
  switch (action.type) {
    case NEW_POST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };
    case NEW_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        postResponse: action.payload.data,
        message: action.payload.message,
        error: null,
      };
    case NEW_POST_ERROR:
      return {
        ...state,
        loading: false,
        error: true, 
        message: action.payload,
      };
    default:
      return state;
  }
}