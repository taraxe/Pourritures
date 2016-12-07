import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';
import {isDisplayable} from '../utils/pourritures';

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

        const withAggData = raw.map(c => {
            return {
                ...c,
                fileCount: c.pourritures.length,
                convictedCount: c.pourritures.filter(isDisplayable).length
            }
        });


        return Object.assign({}, state, {
            isFetching: false,
            data: withAggData
        });
    }
}, initialState);


export default candidatesReducer;
