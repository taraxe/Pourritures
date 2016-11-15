import React from 'react';
import CourtCase  from './CourtCase';

const CourtCases = (props) =>
        <div className="courtcasesList">
            {props.data.map(c => <CourtCase key={c.name} data={c}/>)}
        </div>;

export default CourtCases
