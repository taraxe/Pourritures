import React from 'react';
import ChartContainer from '../containers/ChartContainer';
import CandidateListContainer from '../containers/CandidateListContainer';
import CourtCaseListContainer from '../containers/CourtCaseListContainer';
import StatsContainer from '../containers/StatsContainer';
import Intro from './Intro';
import DocumentTitle from 'react-document-title';

const Home = () => {
    return (
        <DocumentTitle title={window.pourritures.title+' : Accueil'}>
        <div className='container'>
            <div className="row wrapper wrapper-content border-bottom">
                <h1>Pendant les affaires, les affaires continuent</h1>
                <div className="col-lg-12">
                    <Intro/>
                </div>
            </div>
            <div className="row wrapper wrapper-content">
                <h1 className="m-b-lg">Les élus républicains face à la justice</h1>
                <div className="col-lg-12">
                    <StatsContainer/>
                </div>
            </div>
            <div className="row wrapper wrapper-content border-bottom">
                <div className="col-lg-6">
                    <ChartContainer type="grouped"/>
                </div>
                <div className="col-lg-6">
                    <ChartContainer type="splitted"/>
                </div>
            </div>
            <div className="row wrapper wrapper-content border-bottom">
                <h1 className="m-b-lg">Les données sur les candidats à la présidentielle</h1>
                <CandidateListContainer/>
            </div>
            <div className="row wrapper wrapper-content">
                <h1 className="m-b-lg">Les principales affaires</h1>
                <div className="col-lg-10">
                    <CourtCaseListContainer/>
                </div>
            </div>
      </div>
    </DocumentTitle>
    );
};

export default Home;
