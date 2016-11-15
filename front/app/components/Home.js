import React from 'react';
import GroupChartContainer from '../containers/GroupChartContainer';
import Candidates from './Candidates';
import CourtCases from './CourtCases';

const Home = () => {
    return (
      <div>
          <h1>Les élus Républicains sont exemplaires</h1>
          <figure className="cumulated">
            <GroupChartContainer/>
          </figure>

          <Candidates />
          <CourtCases />
      </div>
    );
};

export default Home;
