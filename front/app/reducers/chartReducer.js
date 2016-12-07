import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';
import * as d3 from "d3";
import {PartyColors, PartyList} from '../models/reference';
import tail from 'lodash/tail';
import {isDisplayable} from '../utils/pourritures';


const initialState = {
    isFetching: true,
    charts: []
};

const padding = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
};

const chartReducer = handleActions({
    [Actions.LOAD_GROUP_FETCHING]: (state, action) => {
        return Object.assign({}, state, {
            isFetching: true
        });
    },
    [Actions.LOAD_GROUP_FETCHED]: (state, action) => {

        const raw = action.payload.filter(isDisplayable);

        const perYerPerGroup = d3.nest()
            .key(d => d.year)
            .sortKeys(d3.ascending)
            .rollup(values => values.reduce((acc, i) => {
                return {
                    ...acc,
                    [i.party.shortLabel]: (acc[i.party.shortLabel] ? acc[i.party.shortLabel] : 0) + 1
                }
            }, {}))
            .entries(raw);

        const cols = PartyList.reduce((acc, p, i) => {
            acc[i] = [p, ...perYerPerGroup.reduce((acc, y) => {
                return acc.concat([y.value[p] || 0])
            }, [])];
            return acc;
        }, []);
        const colsNonEmpty = cols.filter(arr => tail(arr).reduce((acc, i) => acc + i) > 0);

        const grouped = {
            padding,
            data: {
                x: 'Année',
                columns: [
                    ['Année', ...perYerPerGroup.map(e => e.key)],
                    ...colsNonEmpty
                ],
                colors: PartyColors,
                groups: [PartyList],
                type: 'area',
                axis: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y'
                    }
                }
            },
            title: 'Nombre de condamnation par parti'
        };

        const perGroup = d3.nest()
            .key(d => d.party.shortLabel)
            .rollup(values => values.length)
            .entries(raw);


        const splitted = {
            padding,
            data: {
                columns: perGroup.map(g => [g.key, g.value]),
                colors: PartyColors,
                type: 'donut',
            },
            title: 'Répartition globale par parti'
        };

        return Object.assign({}, state, {
            isFetching: false,
            charts: {
                splitted,
                grouped,
            }
        });
    }
}, initialState);


export default chartReducer;
