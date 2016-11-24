import React from 'react';
import {Link} from 'react-router';
import { pluralize } from '../utils';

const courtCase = (props) =>
    <li className="list-group-item">
        <h2>{props.name}</h2>
        <p>{props.description} <small><a href={props.link} target="_blank">En savoir plus ></a></small></p>

        <h4>{pluralize(props.pourritures, "Elu impliqué", "Elus impliqués")}:</h4>
        <ul className="unstyled">
            {props.pourritures.map(p =>
                <li key={p.slug}><Link to={"/ordures/"+p.slug}>{p.name}</Link></li>
            )}
        </ul>
    </li>;

export default courtCase
