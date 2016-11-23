import React from 'react';
import CandidateItem from './CandidateItem';
import chunk from 'lodash/chunk';

const Candidates = function(props) {
    //console.log("in CandidateList", props);

    return (
        <div className="candidatesList">
            {chunk(props.data,6).map(group =>
            <div className="row">
                {group.map(c =>
                    <CandidateItem key={c.slug} {...c}/>
                )}
            </div>
            )}
        </div>
    );
};
export default Candidates;
