import { createAction } from 'redux-actions';
import * as Action from './constants';

import pourritures from '../data/pourritures.json';
import candidates from '../data/candidats.json';
import courtCases from '../data/courtcases.json';


const groupsFetched = createAction(Action.LOAD_GROUP_DATA_FETCHED);
const groupsFetching = createAction(Action.LOAD_GROUP_DATA_FETCHING);

export function fetchGroups(){
  return (dispatch) => {
      dispatch(groupsFetching());
      new Promise((resolve, _) => resolve(pourritures))
          .then((response) => dispatch(groupsFetched(response)))
          .catch((err) => dispatch(groupsFetched(new Error(JSON.stringify(err)))));
  };
}


const candidatesFetched = createAction(Action.LOAD_CANDIDATES_DATA_FETCHED);
const candidatesFetching = createAction(Action.LOAD_CANDIDATES_DATA_FETCHING);

export function fetchCandidates(){
    return (dispatch) => {
        dispatch(candidatesFetching());
        new Promise((resolve, _) => resolve(candidates))
            .then((response) => dispatch(candidatesFetched(response)))
            .catch((err) => dispatch(candidatesFetched(new Error(JSON.stringify(err)))));
    };
}


const courtCasesFetched = createAction(Action.LOAD_COURTCASES_DATA_FETCHED);
const courtCasesFetching = createAction(Action.LOAD_COURTCASES_DATA_FETCHING);

export function fetchCourtCases(){
    return (dispatch) => {
        dispatch(courtCasesFetching());
        new Promise((resolve, _) => resolve(courtCases))
            .then((response) => dispatch(courtCasesFetched(response)))
            .catch((err) => dispatch(courtCasesFetched(new Error(JSON.stringify(err)))));
    };
}
