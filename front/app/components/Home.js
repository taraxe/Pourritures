import React from 'react';
import ChartContainer from '../containers/ChartContainer';
import CandidateListContainer from '../containers/CandidateListContainer';
import CourtCaseListContainer from '../containers/CourtCaseListContainer';

const Home = () => {
    return (
    <div className='row wrapper wrapper-content white-bg'>
        <div className='container'>
            <div className="row">
                <div className="col-lg-6">
                    <h1>Nos élus sont exemplaires</h1>
                    <ChartContainer type="cumulated"/>
                </div>
                <div className="col-lg-6">
                    <h1>Leurs partis politiques aussi</h1>
                    <ChartContainer type="grouped"/>
                </div>
            </div>
            <div className="row">
                <h1>Les candidats à la présidentielle</h1>
                <CandidateListContainer/>
            </div>
            <div className="row">
                <h1>Nos affaires préférées</h1>
                <div className="col-lg-6">
                    <CourtCaseListContainer/>
                </div>
            </div>
      </div>
    </div>
    );
};

export default Home;
