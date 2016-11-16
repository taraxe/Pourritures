import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';

const initialState = {
    isFetching : true,
    data: []
};


const courtCasesReducer = handleActions({
    [Actions.LOAD_COURTCASES_FETCHING]: (state, action) => {
        return Object.assign({}, state, {
            isFetching: true
        });
    },
    [Actions.LOAD_COURTCASES_FETCHED]: (state, action) => {
        const raw = action.payload;
        return Object.assign({}, state, {
            isFetching: false,
            data: raw
        });
    }
}, initialState);


export default courtCasesReducer;
