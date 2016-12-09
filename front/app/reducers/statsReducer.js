import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';
import countBy from 'lodash/countBy';
import toArray from 'lodash/toArray';
import {isDisplayable} from '../utils/pourritures';

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

        const totalElected = toArray(countBy(raw, 'slug')).length;
        const totalFiles = toArray(countBy(raw, 'slug')).reduce((acc, i) => acc + i, 0);
        const totalConvicted = raw.filter(isDisplayable).length;

        const stats = {
            totalElected,
            totalFiles,
            totalConvicted,
            avConvictedByElected: (totalFiles/totalElected).toFixed(2)
        };

        return Object.assign({}, state, {
            isFetching: false,
            data: stats
        });
    }
}, initialState);


export default statsReducer;
