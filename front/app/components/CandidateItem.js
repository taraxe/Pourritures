import React from 'react';
import {Link} from 'react-router';

const candidate = (props) =>
    <div className="ordure-details col-md-3 p-md m-t-md m-b-md">
        <div className="text-center">
            <img className="candidate-thumbnail img-lg img-circle img-shadow" src={"images/assets/candidates/"+props.slug+".jpg"} />
            <span className="clear"></span>
            <Link to={"/ordures/"+props.slug}><h2>{props.name}</h2></Link>
            <span>{props.party}</span>
        </div>
    </div>;

export default candidate
