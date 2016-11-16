import { createAction } from 'redux-actions';
import * as Action from './constants';

import slugify from '../utils';

import 'whatwg-fetch'

import pourritures from '../data/pourritures.json';
import candidates from '../data/candidats.json';
import courtCases from '../data/courtcases.json';


const groupsFetched = createAction(Action.LOAD_GROUP_FETCHED);
const groupsFetching = createAction(Action.LOAD_GROUP_FETCHING);

export function fetchGroups(){
  return (dispatch) => {
      dispatch(groupsFetching());
      new Promise((resolve, _) => resolve(pourritures))
          .then(response => dispatch(groupsFetched(response)))
          .catch(err => dispatch(groupsFetched(new Error(JSON.stringify(err)))));
  };
}


const candidatesFetched = createAction(Action.LOAD_CANDIDATES_FETCHED);
const candidatesFetching = createAction(Action.LOAD_CANDIDATES_FETCHING);

export function fetchCandidates(){
    return (dispatch) => {
        dispatch(candidatesFetching());
        new Promise((resolve, _) => resolve(candidates))
            .then(response => dispatch(candidatesFetched(response)))
            .catch(err => dispatch(candidatesFetched(new Error(JSON.stringify(err)))));
    };
}


const courtCasesFetched = createAction(Action.LOAD_COURTCASES_FETCHED);
const courtCasesFetching = createAction(Action.LOAD_COURTCASES_FETCHING);

export function fetchCourtCases(){
    return (dispatch) => {
        dispatch(courtCasesFetching());
        new Promise((resolve, _) => resolve(courtCases))
            .then(response => dispatch(courtCasesFetched(response)))
            .catch(err => dispatch(courtCasesFetched(new Error(JSON.stringify(err)))));
    };
}

const personDetailsFetched = createAction(Action.LOAD_PERSON_DETAILS_FETCHED);
const personDetailsFetching = createAction(Action.LOAD_PERSON_DETAILS_FETCHING);

export function fetchPersonDetails({slug}){
    return (dispatch) => {
        dispatch(personDetailsFetching({slug}));
        const match = pourritures.filter(d => slugify(d.name) === slug) || [];
        new Promise((resolve, _) => resolve(match))
            .then(response => dispatch(personDetailsFetched({data: response, slug})))
            .catch(err => dispatch(personDetailsFetched(new Error(JSON.stringify(err)))));
    };
}

const contributorsFetched = createAction(Action.LOAD_CONTRIBUTORS_FETCHED);
const contributorsFetching = createAction(Action.LOAD_CONTRIBUTORS_FETCHING);

export function fetchContributors(){
    return (dispatch) => {
        dispatch(contributorsFetching());
        fetch('https://api.github.com/repos/taraxe/pourritures/stats/contributors')
            .then(response => response.json())
            .then(json => dispatch(contributorsFetched(json)))
            .catch(err => dispatch(contributorsFetched(new Error(JSON.stringify(err)))));
    };
}


