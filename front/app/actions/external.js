import { createAction } from 'redux-actions';
import * as Action from './constants';
import 'whatwg-fetch'


const contributorsFetched = createAction(Action.LOAD_CONTRIBUTORS_FETCHED);
const contributorsFetching = createAction(Action.LOAD_CONTRIBUTORS_FETCHING);

export const fetchContributors = () => (dispatch) => {
        dispatch(contributorsFetching());
        fetch('https://api.github.com/repos/taraxe/pourritures/stats/contributors')
            .then(response => response.json())
            .then(json => dispatch(contributorsFetched(json)))
            .catch(err => dispatch(contributorsFetched(new Error(JSON.stringify(err)))));
};
