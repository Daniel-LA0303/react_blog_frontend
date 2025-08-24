import {
    NEW_POST,
    NEW_POST_SUCCESS,
    NEW_POST_ERROR,
    DELETE_POST_ERROR,
    DELETE_POST,
    DELETE_COMMENT,
    DELETE_POST_SUCCESS
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
    case DELETE_POST:
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

    case DELETE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        postResponse: null,
        message: action.payload,
        error: null,
      };

    case NEW_POST_ERROR:
    case DELETE_POST_ERROR:
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