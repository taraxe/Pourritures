import { combineReducers } from 'redux';
import * as Actions from '../actions/constants';
import {handleAction, handleActions} from 'redux-actions';
import { routerReducer } from 'react-router-redux';

const initialState = {
	isFetching : false,
};

const firstReducer = handleActions({
    /*[Actions.USER_FETCHING]: (state, action) => {
      return Object.assign({}, state, {
        isFetching: true
      });
    },
    [Actions.USER_FETCHED]: (state, action) => {
      return Object.assign({}, state, {
        isFetching: false,
        playerOne: action.payload
      });
    }*/
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
    firstReducer

    /*secondReducer,
    thirdReducer*/
});

export default rootReducer;
