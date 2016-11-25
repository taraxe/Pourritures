import React from 'react';
import {slugify} from '../utils';

const personDetails = (props) =>
    <div className='container'>
        <div className='row wrapper wrapper-content'>
            <img className="img-lg" src={"/images/assets/candidates/" + props.slug + ".jpg"}/>
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
    </div>;

export default personDetails
