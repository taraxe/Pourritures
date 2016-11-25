import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';
import * as d3 from "d3";

const initialState = {
    isFetching : true,
    name: '',
    slug: '',
    cases : []
};


const candidatesReducer = handleActions({
    [Actions.LOAD_PERSON_DETAILS_FETCHING]: (state, action) => {
        return Object.assign({}, state, {
            isFetching: true
        });
    },
    [Actions.LOAD_PERSON_DETAILS_FETCHED]: (state, action) => {
        const {data, _} = action.payload;
        return Object.assign({}, state, {
            isFetching: false,
            slug: data[0].slug,
            name: data[0].name,
            cases: data,
        });
    }
}, initialState);


export default candidatesReducer;
