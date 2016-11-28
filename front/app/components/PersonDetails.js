import React from 'react';
import {slugify} from '../utils';

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
            <ol>
                {props.cases.map( (c,i) =>
                    <li key={"case-"+i}>
                        <h2>{c.year}</h2>
                        <ul>
                            {c.charges.map((r,i) =>
                                <li key={"charge-"+i}>{r}</li>
                            )}
                        </ul>
                    </li>
                )}
            </ol>
        </div>
    </div>)};

export default personDetails
