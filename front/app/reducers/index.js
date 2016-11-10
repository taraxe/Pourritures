import { combineReducers } from 'redux';
import * as Actions from '../actions/constants';
import {handleAction, handleActions} from 'redux-actions';
import { routerReducer } from 'react-router-redux';
import * as d3 from "d3";

const initialState = {
	isFetchingGroupData : false,
    groupData: []
};

const dataReducer = handleActions({
    [Actions.LOAD_GROUP_DATA_FETCHING]: (state, action) => {
      return Object.assign({}, state, {
          isFetchingGroupData: true
      });
    },
    [Actions.LOAD_GROUP_DATA_FETCHED]: (state, action) => {

      const raw = action.payload;

        // TODO reduce the data to fit the chart input
        const cum = d3
            .nest().key(d => d.annee)
            .entries(raw);

        console.log(cum);

      return Object.assign({}, state, {
          isFetchingGroupData: false,
          groupData: raw
      });
    }
}, initialState);

// function secondReducer(state = initialState, action) {
//   switch (action.type) {
//     case Actions.FETCH_USER:
//         console.log('Reducer', state, action);
//         return Object.assign({}, state, {
//                  isFetching: true
//         });
//     case Actions.USER_FETCHED:
//         console.log('Reducer', state, action);
//         return Object.assign({}, state, {
//                  isFetching: false,
//                  playerOne: action.playload
//         });
//     default:
//       console.log("Default state ", state, action);
//       return state;
//   }
// }

// const thirdReducer = handleAction(Actions.USER_FETCHED, (state = initialState, action) => {
//       console.log(action);
//       return state;
// });

const rootReducer = combineReducers({
    routing: routerReducer,
    data : dataReducer

    /*secondReducer,
    thirdReducer*/
});

export default rootReducer;
