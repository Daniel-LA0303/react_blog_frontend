const initialState = {
    posts:[],
    post:{},
    categories:[],
    error: null,
    loading: false,
    PFLink: 'http://localhost:4000/uploads/'
}


export default function(state = initialState, action){
    switch(action.type){

        default: return state;
    }
}