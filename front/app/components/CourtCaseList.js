import React from 'react';
import CourtCase  from './CourtCase';
import {slugify} from '../utils';

const CourtCaseList = (props) =>
        <ul className="list-group">
            {props.data.map(c => <CourtCase key={slugify(c.name)} {...c}/>)}
        </ul>;

export default CourtCaseList;
