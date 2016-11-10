import React from 'react';
import GroupChartContainer from '../containers/GroupChartContainer';

const Home = () => {
    return (
      <div>
          <h1>Les élus Républicains sont exemplaires</h1>
          <figure className="cumulated">
            <GroupChartContainer/>
          </figure>
      </div>
    );
};

export default Home;
