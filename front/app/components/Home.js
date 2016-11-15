import React from 'react';
import GroupChartContainer from '../containers/GroupChartContainer';
import CandidateListContainer from '../containers/CandidateListContainer';
import CourtCaseListContainer from '../containers/CourtCaseListContainer';

const Home = () => {
    return (
      <div>
          <h1>Les élus Républicains sont exemplaires</h1>
          <figure className="cumulated">
            <GroupChartContainer/>
          </figure>
          <CandidateListContainer/>
          <CourtCaseListContainer/>
      </div>
    );
};

export default Home;
