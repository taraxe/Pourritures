import React from 'react';
import CandidateItem from './CandidateItem';

const Candidates = function(props) {
    //console.log("in CandidateList", props);

    return (
        <div className="candidatesList">
            {props.data.map(c => <CandidateItem key={c.name} data={c}/>)}
        </div>
    );
};
export default Candidates;
