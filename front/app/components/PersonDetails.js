import React from 'react';

const personDetails = (props) =>
    <div className="personDetail">
        <h1>{props.data.name}</h1>
        <ol>
            {props.data.cases.map(c =>
                <li>
                    <h2>{c.annee}</h2>
                    <ul>
                    {c.raison.map(r =>
                        <li>{r}</li>
                    )}
                    </ul>
                </li>
            )}
        </ol>
    </div>;

export default personDetails
