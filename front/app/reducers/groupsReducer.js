import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';
import * as d3 from "d3";

const initialState = {
    isFetching : true,
    data: []
};

const groupsReducer = handleActions({
    [Actions.LOAD_GROUP_FETCHING]: (state, action) => {
        return Object.assign({}, state, {
            isFetching: true
        });
    },
    [Actions.LOAD_GROUP_FETCHED]: (state, action) => {

        const raw = action.payload;

        const perYer = d3.nest()
            .key(d => d.annee)
            .sortKeys(d3.ascending)
            .rollup( values => values.length)
            .entries(raw);

        const sum = (prev, curr) => {
            const last = prev.slice(-1)[0] || 0;
            return prev.concat([curr.value + last]);
        };

        const summed = {
            x: 'Année',
            columns : [
                ['Année', ...perYer.map(e => e.key)],
                ['Nb Affaires', ...perYer.map(e => e.value)],
                ['Cumul', ...perYer.reduce(sum, [])]
            ],
            axis : {
                type: 'timeseries',
                tick: {
                    format: '%Y'
                }
            }
        };

        const perYerPerGroup = d3.nest()
            .key(d => d.annee)
            .sortKeys(d3.ascending)
            .rollup(function(values){
                const filter = g => d => d.formation === g;
                return {
                 ps: values.filter(filter("ps")).length,
                 lr: values.filter(filter("ump")).length,
                 fn: values.filter(filter("fn")).length
                }
            })
            .entries(raw);

        const grouped = {
            x: 'Année',
            columns : [
                ['Année', ...perYer.map(e => e.key)],
                ['PS', ...perYerPerGroup.map(e => e.value.ps)],
                ['LR', ...perYerPerGroup.map(e => e.value.lr)],
                ['FN', ...perYerPerGroup.map(e => e.value.fn)]
            ],
            colors: {
                FN: '#0000ff',
                PS: '#ff0000',
                LR: '#3695ff'
            },
            groups: [['FN', 'LR', 'PS']],
            type: 'bar',
            axis : {
                type: 'timeseries',
                tick: {
                    format: '%Y'
                }
            }
        };

        console.log("Sum", perYerPerGroup);

        return Object.assign({}, state, {
            isFetching: false,
            data : {
                summed,
                grouped
            }
        });
    }
}, initialState);


export default groupsReducer;
