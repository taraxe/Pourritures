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
      <div className="candidatesList">
        {listCandidates}
      </div>
    )
  }
})
export default Candidates;
