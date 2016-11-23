import React from 'react';
import {Link} from 'react-router';

const candidate = (props) =>
    <div className="ordure-details col-md-2">
        <img className="candidate-thumbnail img-lg img-circle img-shadow" src={"images/assets/candidates/"+props.slug+".jpg"} />
        <Link to={"/ordures/"+props.slug}>{props.name}</Link>
        <h3>{props.party}</h3>
    </div>;

export default candidate
