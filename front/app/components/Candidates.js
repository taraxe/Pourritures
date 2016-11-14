import React from 'react';
import candidates from '../data/candidats.json';

const Candidates = React.createClass({
  render: function(){
    var listCandidates = candidates.map(function(ordures){
      return (
        <div className="candidate">
          {ordures.name}
        </div>
      )
    });
    return(
      <div>
      <h2>Nos candidats</h2>
        <div className="candidatesList">
          {listCandidates}
        </div>
      </div>
    )
  }
})
export default Candidates;
