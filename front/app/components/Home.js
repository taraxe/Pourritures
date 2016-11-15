import React from 'react';
import GroupChartContainer from '../containers/GroupChartContainer';
import CandidateListContainer from '../containers/CandidateListContainer';
import CourtCaseListContainer from '../containers/CourtCaseListContainer';

const Home = () => {
    return (
      <div>
          <h1>Nos élus sont exemplaires</h1>
          <figure className="cumulated">
            <GroupChartContainer/>
          </figure>
          <h1>Leurs partis politiques</h1>
          <figure className="cumulated">
              <GroupChartContainer/>
          </figure>

          <h1>Les candidats à la présidentielle</h1>
          <CandidateListContainer/>

          <h1>Nos affaires préférées</h1>
          <CourtCaseListContainer/>
      </div>
    );
};

export default Home;
