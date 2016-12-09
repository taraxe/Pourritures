import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';
import * as d3 from "d3";

const initialState = {
    isFetching : true,
    name: undefined,
    slug: undefined,
    image: undefined,
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
        const {pourritures, slug, name, image} = action.payload;

        const perYer = d3.nest()
            .key(d => d.year)
            .sortKeys(d3.descending)
            .entries(pourritures);

        return Object.assign({}, state, {
            isFetching: false,
            slug,
            name,
            image,
            casesPerYear: perYer,
        });
    },
    [Actions.LOAD_DEPUTE_FETCHED]: (state, action) => {
        const raw = action.payload;
        const merged = raw.depute || raw.senateur;

        console.log(raw);

        const nbMandats = merged ? merged.nb_mandats : 0;
        const twitter = merged ? merged.twitter : undefined;
        const img = merged ? `http://www.nosdeputes.fr/depute/photo/${merged.slug}/250` : undefined;
        const responsabilites = merged ? merged.responsabilites : [];

        return Object.assign({}, state, {
            isFetching: false,
            nbMandats,
            twitter,
            image: state.image || img,
            responsabilites
        });
    }
}, initialState);


export default candidatesReducer;
