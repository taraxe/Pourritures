import React from 'react';
import {capitalize} from '../utils';

const personDetails = (props) => {
    const style = {
        backgroundImage: "url(/images/assets/candidates/"+props.slug+".jpg)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
    };

    return (<div className='container'>
        <div className='row wrapper wrapper-content'>
            <img className="img-lg img-circle" style={style}/>
            <h1 className="m-b-lg">{props.name}</h1>
            <ol className="unstyled">
                {props.casesPerYear.map( ({ key, values }, i) =>
                    <li key={"case-"+key+"-"+i}>
                        <h2>{key}</h2>
                        <ol className="unstyled">
                            {values.map(({conviction, charges},i) =>
                                <li key={"charge-"+key+"-"+i}>{capitalize(conviction.label)} pour {charges.join(", ")}</li>
                            )}
                        </ol>
                    </li>
                )}
            </ol>
        </div>
    </div>)};

export default personDetails
