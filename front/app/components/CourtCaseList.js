import React from 'react';
import CourtCase  from './CourtCase';

const CourtCases = (props) =>
    <div>
        <h2>Nos affaires préférées</h2>
        <div className="courtcasesList">
            {props.data.map(c => <CourtCase key={c.name} data={c}/>)}
        </div>
    </div>;

export default CourtCases
