import React from 'react';
import courtcases from '../data/courtcases.json';

const CourtCases = React.createClass({
  render: function(){
    var listCourtCases = courtcases.map(function(cases){
      return (
        <div className="courtcase">
          {cases.name} - {cases.description}
        </div>
      )
    });
    return(
      <div>
        <h2>Nos affaires préférées</h2>
        <div className="courtcasesList">
          {listCourtCases}
        </div>
      </div>
    )
  }
})
export default CourtCases;
