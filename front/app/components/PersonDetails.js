import React from 'react';
import slugify from '../utils';

const personDetails = (props) =>
    <div className="personDetail">
      <img src={"images/assets/candidates/"+slugify(props.data.name)+".jpg"}/>
        <h1>Ordure {props.data.name}</h1>
        <ol>
            {props.data.cases.map(c =>
                <li>
                    <h2>{c.year}</h2>
                    <ul>
                    {c.charges.map(r =>
                        <li>{r}</li>
                    )}
                    </ul>
                </li>
            )}
        </ol>
    </div>;

export default personDetails
