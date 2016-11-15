import React from 'react';
import Candidate from './Candidate';

const Candidates = (props) =>
      <div>
        <h2>Nos candidats</h2>
        <div className="candidatesList">
          {props.data.map(c => <Candidate data={c}/>)}
        </div>
      </div>;

export default Candidates;
