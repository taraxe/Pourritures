import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';

const initialState = {
    isFetching : true,
    data: []
};


const contributorsReducer = handleActions({
    [Actions.LOAD_CONTRIBUTORS_FETCHING]: (state, action) => {
        return Object.assign({}, state, {
            isFetching: true
        });
    },
    [Actions.LOAD_CONTRIBUTORS_FETCHED]: (state, action) => {
        const raw = action.payload;

        const filtered = raw.map(c => c.author).map(c => {
            return {
                name: c.login,
                url: c.html_url,
                avatar: c.avatar_url
            }
        });

        return Object.assign({}, state, {
            isFetching: false,
            data: filtered
        });
    }
}, initialState);


export default contributorsReducer;
