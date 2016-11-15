import React from 'react';
import {Link} from 'react-router';
import slugify from '../utils'

const candidate = (props) =>
    <div className="ordure-details">
        <Link to={"/ordures/"+slugify(props.data.name)}>{props.data.name}</Link>
    </div>;

export default candidate
