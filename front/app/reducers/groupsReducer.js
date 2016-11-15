import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';
import * as d3 from "d3";

const initialState = {
    isFetching : true,
    data: []
};

const groupsReducer = handleActions({
    [Actions.LOAD_GROUP_DATA_FETCHING]: (state, action) => {
        return Object.assign({}, state, {
            isFetching: true
        });
    },
    [Actions.LOAD_GROUP_DATA_FETCHED]: (state, action) => {

        const raw = action.payload;
        // TODO reduce the data to fit the chart input
        /*const cum = d3
            .nest().key(d => d.annee)
            .entries(raw);

        console.log("Groupes", cum);*/

        return Object.assign({}, state, {
            isFetching: false,
            data: raw
        });
    }
}, initialState);


export default groupsReducer;
