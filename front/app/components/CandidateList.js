import React from 'react';
import Candidate from './Candidate';

const Candidates = function(props) {
    //console.log("in CandidateList", props);

    return (
    <div>
        <h2>Nos candidats</h2>
        <div className="candidatesList">
            {props.data.map(c => <Candidate key={c.name} data={c}/>)}
        </div>
    </div>);
};
export default Candidates;
