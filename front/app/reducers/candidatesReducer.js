import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';

const initialState = {
    isFetching : true,
    data: []
};


const candidatesReducer = handleActions({
    [Actions.LOAD_CANDIDATES_FETCHING]: (state, action) => {
        return Object.assign({}, state, {
            isFetching: true
        });
    },
    [Actions.LOAD_CANDIDATES_FETCHED]: (state, action) => {
        const raw = action.payload;
        //console.log("HIT",raw);
        return Object.assign({}, state, {
            isFetching: false,
            data: raw
        });
    }
}, initialState);


export default candidatesReducer;
