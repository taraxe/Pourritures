import React from 'react';
import {Link} from 'react-router';
import slugify from '../utils';

const candidate = (props) =>
    <div className="ordure-details">
        <img class="candidate-thumbnail" src={"images/assets/candidates/"+slugify(props.data.name)+".jpg"} />
        <Link to={"/ordures/"+slugify(props.data.name)}>{props.data.name}</Link>
        <h3>{props.data.party}</h3>
    </div>;

export default candidate
