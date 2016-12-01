import {createAction} from 'redux-actions';
import * as Action from './constants';
import 'whatwg-fetch';
import compact from "lodash/compact";


const contributorsFetched = createAction(Action.LOAD_CONTRIBUTORS_FETCHED);
const contributorsFetching = createAction(Action.LOAD_CONTRIBUTORS_FETCHING);

export const fetchContributors = () => (dispatch) => {
    dispatch(contributorsFetching());
    fetch('https://api.github.com/repos/taraxe/pourritures/stats/contributors')
        .then(response => response.json())
        .then(json => dispatch(contributorsFetched(json)))
        .catch(err => dispatch(contributorsFetched(new Error(JSON.stringify(err)))));
};

const deputeFetched = createAction(Action.LOAD_DEPUTE_FETCHED);
const deputeFetching = createAction(Action.LOAD_DEPUTE_FETCHING);

export const fetchDepute = ({slug}) => (dispatch) => {
    const opts = {
        headers: {
            'Accept': 'application/json'
        }
    };
    dispatch(deputeFetching());
    Promise.all([
        fetch(`https://www.nosdeputes.fr/${slug}/json`, opts),
        fetch(`https://www.nossenateurs.fr/${slug}/json`, opts)
    ])
        .then(responses => {
            const res = responses.map(r => r.json().then(json => json, err => undefined));
            return Promise.all(res).then(arr => compact(arr).reduce((a,b) => { return {...a, ...b}}, {}))
        })
        .then(json => dispatch(deputeFetched(json)))
        .catch(err => dispatch(deputeFetched(new Error(JSON.stringify(err)))))
};

