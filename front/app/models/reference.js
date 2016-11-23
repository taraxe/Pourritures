import * as d3 from "d3";
import {slugify, distinct} from '../utils';

import charges from '../data/charges.json';
import convictions from '../data/convictions.json';
import parties from '../data/parties.json';
import cases from '../data/courtcases.json';

import pourritures from '../data/pourritures.json';
import candidates from '../data/candidats.json';

export const PartyMap = d3.nest()
        .key(d => d.id)
        .rollup(values => {
            return {
                label: values[0].label,
                shortLabel: values[0].shortLabel
            }
        })
        .object(parties);

export const ConvictionMap = d3.nest()
        .key(d => d.id)
        .rollup(values => {
            return {
                label: values[0].label
            }
        })
        .object(convictions);

export const ChargeMap = d3.nest()
        .key(d => d.id)
        .rollup(values => {
            return {
                label: values[0].label
            }
        })
        .object(charges);

export const CourtcaseMap = d3.nest()
    .key(d => d.id)
    .rollup(values => {
        return {
            name: values[0].name,
            description: values[0].description,
            link: values[0].link,
        }
    })
    .object(cases);

export const Pourritures = pourritures.map(p => {
    return {
        slug: slugify(p.name),
        ...p,
        party: p.party ? PartyMap[p.party] : undefined
    }
});

export const Candidates = candidates.map( c => {
    const slug = slugify(c.name);
    const dossiers = pourritures.filter(p => slugify(p.name) == slug);
    //const cases = dossiers.map(d => d.courtcase).filter(distinct).map(id => CourtcaseMap[id]).filter(c => c !== undefined);
    return {
        slug,
        pourritures: dossiers,
        //courtcases: cases,
        ...c
    }
});


export default { PartyMap, ConvictionMap, ChargeMap, CourtcaseMap, Pourritures, Candidates }

