import { createAction } from 'redux-actions';
import * as Action from './constants';
import data from '../data/pourritures.json';

const groupDataFetched = createAction(Action.LOAD_GROUP_DATA_FETCHED);
const groupDataFetching = createAction(Action.LOAD_GROUP_DATA_FETCHING);

export function fetchGroupData(){
  return (dispatch) => {
      dispatch(groupDataFetching());
      new Promise( // make it like it's asynchronous, cause in the future we might call a backend
        function(resolve, reject){
          console.log("FETCHED");
          resolve({data})
        }
      ).then((response) => dispatch(groupDataFetched(response.data)))
      .catch((err) => dispatch(groupDataFetched(new Error(JSON.stringify(err)))));
  };
}
