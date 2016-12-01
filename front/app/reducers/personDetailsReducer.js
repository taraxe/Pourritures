import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';
import * as d3 from "d3";

const initialState = {
    isFetching : true,
    name: undefined,
    slug: undefined,
    nbMandats: undefined,
    twitter: undefined,
    email: undefined,
    responsabilites: [],
    cases : []
};


const candidatesReducer = handleActions({
    [Actions.LOAD_PERSON_DETAILS_FETCHING]: (state, action) => {
        return Object.assign({}, state, {
            isFetching: true
        });
    },
    [Actions.LOAD_PERSON_DETAILS_FETCHED]: (state, action) => {
        const {pourritures, slug, name} = action.payload;
        //console.log(action.payload);
        const perYer = d3.nest()
            .key(d => d.year)
            .sortKeys(d3.descending)
            .entries(pourritures);

        return Object.assign({}, state, {
            isFetching: false,
            slug,
            name,
            casesPerYear: perYer,
        });
    },
    [Actions.LOAD_DEPUTE_FETCHED]: (state, action) => {
        const raw = action.payload;
        const merged = raw.depute || raw.senateur;

        return Object.assign({}, state, {
            isFetching: false,
            nbMandats: merged.nb_mandats,
            twitter: merged.twitter,
            responsabilites: merged.responsabilites
        });
    }
}, initialState);


export default candidatesReducer;
