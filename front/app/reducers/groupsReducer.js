import * as Actions from '../actions/constants';
import {handleActions} from 'redux-actions';
import * as d3 from "d3";
import { PartyColors } from '../models/reference';


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
            .key(d => d.year)
            .sortKeys(d3.ascending)
            .rollup( values => values.length)
            .entries(raw.filter(d => d.year > 2000));

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
            type: 'spline',
            axis : {
                type: 'timeseries',
                tick: {
                    format: '%Y'
                }
            }
        };

        const perYerPerGroup = d3.nest()
            .key(d => d.year)
            .sortKeys(d3.ascending)
            .rollup(function(values){
                const withParty = g => d => d.party.shortLabel === g;
                return {
                 ps: values.filter(withParty("PS")).length,
                 lr: values.filter(withParty("LR")).length,
                 fn: values.filter(withParty("FN")).length,
                 //udi: values.filter(withParty("UDI")).length
                }
            })
            .entries(raw);

        const grouped = {
            x: 'Année',
            columns : [
                ['Année', ...perYer.map(e => e.key)],
                ['PS', ...perYerPerGroup.map(e => e.value.ps)],
                ['LR', ...perYerPerGroup.map(e => e.value.lr)],
                //['UDI', ...perYerPerGroup.map(e => e.value.udi)],
                ['FN', ...perYerPerGroup.map(e => e.value.fn)]
            ],
            colors: PartyColors,
            groups: [['FN', 'LR', 'PS'/*, 'UDI'*/]],
            type: 'area-spline',
            axis : {
                type: 'timeseries',
                tick: {
                    format: '%Y'
                }
            }
        };

        const perGroup = d3.nest()
            .key(d => d.party.shortLabel)
            .rollup(values => values.length)
            .entries(raw);

        console.log(perGroup);

        const splitted = {
            columns : perGroup.map(g => [g.key, g.value]),
            colors: PartyColors,
            //groups: [['FN', 'LR', 'PS']],
            type: 'donut'
        };

        return Object.assign({}, state, {
            isFetching: false,
            data : {
                summed,
                splitted,
                grouped,
            }
        });
    }
}, initialState);


export default groupsReducer;
