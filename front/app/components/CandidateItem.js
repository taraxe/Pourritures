import React from 'react';
import {Link} from 'react-router';

const candidate = (props) => {
    const style = {
        backgroundImage: "url(/images/assets/candidates/"+props.slug+".jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };

    return (<div className="ordure-details col-md-3 p-md m-t-md m-b-md">
        <div className="text-center">
            <img className="img-lg img-circle" style={style}/>
            <span className="clear"/>
            <Link to={"/ordures/"+props.slug}><h2>{props.name}</h2></Link>
            <span>{props.party}</span>
        </div>
    </div>)};

export default candidate
