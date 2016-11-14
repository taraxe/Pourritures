import React from 'react';
import pourritures from '../data/pourritures.json';
import * as d3 from 'd3';
import Chart from './Chart';
import Candidates from './Candidates';
import CourtCases from './CourtCases';

const Home = () => {
    const cumulated = d3.nest()
            .key(function(d){return d.annee})
            .sortKeys(d3.ascending)
            .rollup(function(values){
                var f = function (d) {return +d.raison.length},
                    filter = function(g){ return function(d){ return d.formation === g}};
                return [
                    d3.sum(values, f),
                    d3.sum(values.filter(filter("ps")), f),
                    d3.sum(values.filter(filter("ump")), f),
                    d3.sum(values.filter(filter("fn")), f)
                ]
            })
            .entries(pourritures)
            .map(function(d, i, arr){
                d.value.push( (i > 0 ? arr[i-1].value[4] : 0) + d.value[0]);
                return d;
            });
    return (
      <div>
          <h1>Les élus Républicains sont exemplaires</h1>
          <figure className="cumulated">
            <Chart width={800} height={600} data={cumulated}/>
          </figure>
          <Candidates />
          <CourtCases />
      </div>
    );
};

export default Home;
