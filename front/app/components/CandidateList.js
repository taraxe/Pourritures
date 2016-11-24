import React from 'react';
import CandidateItem from './CandidateItem';
import chunk from 'lodash/chunk';

const Candidates = function(props) {

    return (
        <div className="candidatesList">
            {chunk(props.data,4).map((group, i) =>
            <div className="row" key={"group"+i}>
                {group.map(c =>
                    <CandidateItem key={c.slug} {...c}/>
                )}
            </div>
            )}
        </div>
    );
};
export default Candidates;
