import { createAction } from 'redux-actions';
import * as Action from './constants';
import { Pourritures, Candidates, CourtCases } from '../models/reference';


const groupsFetched = createAction(Action.LOAD_GROUP_FETCHED);
const groupsFetching = createAction(Action.LOAD_GROUP_FETCHING);

export function fetchGroups(){
    return (dispatch) => {
        dispatch(groupsFetching());
        Promise.resolve(Pourritures)
            .then(response => dispatch(groupsFetched(response)))
            .catch(err => dispatch(groupsFetched(new Error(JSON.stringify(err)))));
    };
}


const candidatesFetched = createAction(Action.LOAD_CANDIDATES_FETCHED);
const candidatesFetching = createAction(Action.LOAD_CANDIDATES_FETCHING);

export function fetchCandidates(){
    return (dispatch) => {
        dispatch(candidatesFetching());
        Promise.resolve(Candidates)
            .then(response => dispatch(candidatesFetched(response)))
            .catch(err => dispatch(candidatesFetched(new Error(JSON.stringify(err)))));
    };
}


const courtCasesFetched = createAction(Action.LOAD_COURTCASES_FETCHED);
const courtCasesFetching = createAction(Action.LOAD_COURTCASES_FETCHING);

export function fetchCourtCases(){
    return (dispatch) => {
        dispatch(courtCasesFetching());
        Promise.resolve(CourtCases)
            .then(response => dispatch(courtCasesFetched(response)))
            .catch(err => dispatch(courtCasesFetched(new Error(JSON.stringify(err)))));
    };
}

const personDetailsFetched = createAction(Action.LOAD_PERSON_DETAILS_FETCHED);
const personDetailsFetching = createAction(Action.LOAD_PERSON_DETAILS_FETCHING);

export function fetchPersonDetails({slug}){
    return (dispatch) => {
        dispatch(personDetailsFetching({slug}));
        const match = Pourritures.find(d  => d.slug === slug);
        (match ? Promise.resolve(match) : Promise.reject())
            .then(response => dispatch(personDetailsFetched({data: response, slug})))
            .catch(err => dispatch(personDetailsFetched(new Error(JSON.stringify(err)))));
    };
}
