import * as d3 from "d3";
import {slugify, distinct} from '../utils';
import compact from "lodash/compact";


import charges from '../data/charges.json';
import convictions from '../data/convictions.json';
import parties from '../data/parties.json';
import cases from '../data/courtcases.json';

import pourritures from '../data/pourritures.json';
import candidates from '../data/candidats.json';
import courtcases from '../data/courtcases.json';

const nestBy = (array, keyFunction, transform = d => d) => d3.nest()
        .key(keyFunction)
        .rollup(values => {
            return {
                ...transform(values[0])
            }
        })
        .object(array);

const PartyMap = nestBy(parties, d => d.id);
const ConvictionMap = nestBy(convictions, d => d.id);
const ChargeMap = nestBy(charges, d => d.id);
const CourtcaseMap = nestBy(cases, d => d.id);
const PourritureMap = nestBy(pourritures, d => slugify(d.name), d => {
    const chs = d.charges.map(ch => ChargeMap[ch])
    return {
        ...d,
        slug: slugify(d.name),
        charges: compact(chs).map(ch => ch.label),
        conviction: ConvictionMap[d.conviction].label
    }
});

export const Pourritures = pourritures.map(p => {
    const chs = p.charges.map(ch => ChargeMap[ch])
    return {
        ...p,
        slug: slugify(p.name),
        party: p.party ? PartyMap[p.party] : undefined,
        conviction: ConvictionMap[p.conviction],
        charges: compact(chs).map(ch => ch.label)
    }
});

export const Candidates = candidates.map( c => {
    const slug = slugify(c.name);
    const dossiers = Pourritures.filter(p => slugify(p.name) == slug);
    return {
        slug,
        pourritures: dossiers,
        //courtcases: cases,
        ...c
    }
});

export const CourtCases = courtcases.map(c => {
        const ps = pourritures.filter(p => p.courtcase === c.id).concat([]);
        return {
            pourritures: ps.map(p => PourritureMap[slugify(p.name)]),
            ...c
        }
    }).filter(c => c.pourritures.length > 0).sort((a,b) => b.pourritures.length > a.pourritures.length);

export const PartyColors = d3.nest().key(d => d.shortLabel).rollup(values => values[0].color).object(parties);
export const PartyList = parties.map(d => d.shortLabel);

export default { Pourritures, Candidates, CourtCases, PartyColors, PartyList }

