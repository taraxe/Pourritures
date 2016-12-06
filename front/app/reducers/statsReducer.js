import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';

const initialState = {
    isFetching : true,
    data: []
};


const statsReducer = handleActions({
    [Actions.LOAD_STATS_FETCHING]: (state, action) => {
        return Object.assign({}, state, {
            isFetching: true
        });
    },
    [Actions.LOAD_STATS_FETCHED]: (state, action) => {
        const raw = action.payload;

        return Object.assign({}, state, {
            isFetching: false,
            data: raw
        });
    }
}, initialState);


export default statsReducer;
