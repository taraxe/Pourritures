import React from 'react';
import GroupChartContainer from '../containers/GroupChartContainer';
import CandidateList from './CandidateList';
import CourtCaseList from './CourtCaseList';

import candidates from '../data/candidats.json';
import courtcases from '../data/courtcases.json';


const Home = () => {
    return (
      <div>
          <h1>Les élus Républicains sont exemplaires</h1>
          <figure className="cumulated">
            <GroupChartContainer/>
          </figure>
          <CandidateList data={candidates} />
          <CourtCaseList data={courtcases}/>
      </div>
    );
};

export default Home;
