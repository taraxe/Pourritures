import React from 'react';
import ChartContainer from '../containers/ChartContainer';
import CandidateListContainer from '../containers/CandidateListContainer';
import CourtCaseListContainer from '../containers/CourtCaseListContainer';

const Home = () => {
    return (
        <div className='container'>
            {/*<div className="row wrapper wrapper-content border-bottom">
                <div className="col-lg-6">
                    <h1 className="m-b-lg">Nos élus sont exemplaires</h1>
                    <ChartContainer type="cumulated"/>
                </div>
                <div className="col-lg-6">
                    <h1 className="m-b-lg">Leurs partis politiques aussi</h1>
                    <ChartContainer type="grouped"/>
                </div>
            </div>*/}
            <div className="row wrapper wrapper-content border-bottom">
                <h1 className="m-b-lg">Les candidats à la présidentielle</h1>
                <CandidateListContainer/>
            </div>
            <div className="row wrapper wrapper-content">
                <h1 className="m-b-lg">Nos affaires préférées</h1>
                <div className="col-lg-10">
                    <CourtCaseListContainer/>
                </div>
            </div>
      </div>
    );
};

export default Home;
